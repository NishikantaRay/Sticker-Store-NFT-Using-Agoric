/* global process setTimeout */
import fs from 'fs';
import path from 'path';
import temp from 'temp';
import { fork } from 'child_process';
import { promisify } from 'util';
import { resolve as importMetaResolve } from 'import-meta-resolve';
// import { createHash } from 'crypto';

import anylogger from 'anylogger';

// import connect from 'lotion-connect';
// import djson from 'deterministic-json';

import { assert, details as X } from '@agoric/assert';
import {
  loadSwingsetConfigFile,
  buildCommand,
  swingsetIsInitialized,
  initializeSwingset,
  makeSwingsetController,
  buildMailboxStateMap,
  buildMailbox,
  buildPlugin,
  buildTimer,
} from '@agoric/swingset-vat';
import { openSwingStore } from '@agoric/swing-store';
import { connectToFakeChain } from '@agoric/cosmic-swingset/src/sim-chain.js';
import { makeWithQueue } from '@agoric/vats/src/queue.js';

import { deliver, addDeliveryTarget } from './outbound.js';
import { makeHTTPListener } from './web.js';

import { connectToChain } from './chain-cosmos-sdk.js';

const log = anylogger('start');

let swingSetRunning = false;

const fsWrite = promisify(fs.write);
const fsClose = promisify(fs.close);
const rename = promisify(fs.rename);
const symlink = promisify(fs.symlink);
const unlink = promisify(fs.unlink);

async function atomicReplaceFile(filename, contents) {
  const info = await new Promise((resolve, reject) => {
    temp.open(
      {
        dir: path.dirname(filename),
        prefix: `${path.basename(filename)}.`,
      },
      (err, inf) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(inf);
      },
    );
  });
  try {
    // Write the contents, close, and rename.
    await fsWrite(info.fd, contents);
    await fsClose(info.fd);
    await rename(info.path, filename);
  } catch (e) {
    // Unlink on error.
    try {
      await unlink(info.path);
    } catch (e2) {
      // do nothing, we're already failing
    }
    throw e;
  }
}

async function buildSwingset(
  kernelStateDBDir,
  mailboxStateFile,
  argv,
  broadcast,
  defaultManagerType,
) {
  const initialMailboxState = JSON.parse(fs.readFileSync(mailboxStateFile));

  const mbs = buildMailboxStateMap();
  mbs.populateFromData(initialMailboxState);
  const mb = buildMailbox(mbs);
  const cm = buildCommand(broadcast);
  const timer = buildTimer();
  const withInputQueue = makeWithQueue();
  const queueThunkForKernel = withInputQueue(async thunk => {
    thunk();
    // eslint-disable-next-line no-use-before-define
    await processKernel();
  });

  const pluginDir = path.resolve('./plugins');
  fs.mkdirSync(pluginDir, { recursive: true });
  const pluginsPrefix = `${pluginDir}${path.sep}`;
  const importPlugin = async mod => {
    // Ensure they can't traverse out of the plugins prefix.
    const pluginFile = path.resolve(pluginsPrefix, mod);
    assert(
      pluginFile.startsWith(pluginsPrefix),
      X`Cannot load ${pluginFile} plugin; outside of ${pluginDir}`,
    );

    return import(pluginFile);
  };

  const plugin = buildPlugin(pluginDir, importPlugin, queueThunkForKernel);

  const config = await loadSwingsetConfigFile(
    new URL('../solo-config.json', import.meta.url).pathname,
  );
  config.devices = {
    mailbox: {
      sourceSpec: mb.srcPath,
    },
    command: {
      sourceSpec: cm.srcPath,
    },
    timer: {
      sourceSpec: timer.srcPath,
    },
    plugin: {
      sourceSpec: plugin.srcPath,
    },
  };
  const deviceEndowments = {
    mailbox: { ...mb.endowments },
    command: { ...cm.endowments },
    timer: { ...timer.endowments },
    plugin: { ...plugin.endowments },
  };

  const { kvStore, streamStore, snapStore, commit } = openSwingStore(
    kernelStateDBDir,
  );
  const hostStorage = {
    kvStore,
    streamStore,
    snapStore,
  };

  if (!swingsetIsInitialized(hostStorage)) {
    if (defaultManagerType && !config.defaultManagerType) {
      config.defaultManagerType = defaultManagerType;
    }
    await initializeSwingset(config, argv, hostStorage);
  }
  const slogFile = process.env.SOLO_SLOGFILE;
  const controller = await makeSwingsetController(
    hostStorage,
    deviceEndowments,
    { slogFile },
  );

  async function saveState() {
    const ms = JSON.stringify(mbs.exportToData());
    await atomicReplaceFile(mailboxStateFile, ms);
    commit();
  }

  function deliverOutbound() {
    deliver(mbs);
  }

  async function processKernel() {
    await controller.run();
    if (swingSetRunning) {
      await saveState();
      deliverOutbound();
    }
  }

  // Use the input queue to make sure it doesn't overlap with
  // other inbound messages.
  const queuedDeliverInboundToMbx = withInputQueue(
    async function deliverInboundToMbx(sender, messages, ack) {
      assert(Array.isArray(messages), X`inbound given non-Array: ${messages}`);
      // console.debug(`deliverInboundToMbx`, messages, ack);
      if (mb.deliverInbound(sender, messages, ack, true)) {
        await processKernel();
      }
    },
  );

  // Use the input queue to make sure it doesn't overlap with
  // other inbound messages.
  const queuedBoxedDeliverInboundCommand = withInputQueue(
    async function deliverInboundCommand(obj) {
      // this promise could take an arbitrarily long time to resolve, so don't
      // wait on it
      const p = cm.inboundCommand(obj);

      // Register a handler in this turn so that we don't get complaints about
      // asynchronously-handled callbacks.
      p.catch(_ => {});

      // The turn passes...
      await processKernel();

      // We box the promise, so that this queue isn't stalled.
      // The queue protects the above cm.inboundCommand and
      // processKernel calls.
      //
      // The promise to the box is resolved as the return value of
      // this function (which releases the input queue shortly after
      // the processKernel call has completed).
      //
      // The caller can determine if they want to wait for the
      // unboxed promise (which represents the results of the inbound
      // command), which may not ever resolve.
      return [
        p.catch(e => {
          // Rethrow any inboundCommand rejection in the new turn so that our
          // caller must handle it (or be an unhandledRejection).
          throw e;
        }),
      ];
    },
  );

  // Our typical user will always want to wait for the results of
  // the boxed promise, so by default, extract it and await it.
  const queuedDeliverInboundCommand = obj =>
    queuedBoxedDeliverInboundCommand(obj).then(([p]) => p);

  let intervalMillis;

  // Use the input queue to make sure it doesn't overlap with
  // other inbound messages.
  const queuedMoveTimeForward = withInputQueue(
    async function moveTimeForward() {
      const now = Date.now();
      try {
        if (timer.poll(now)) {
          await processKernel();
          log.debug(`timer-provoked kernel crank complete ${now}`);
        }
      } catch (err) {
        log.error(`timer-provoked kernel crank failed at ${now}:`, err);
      } finally {
        // We only rearm the timeout if moveTimeForward has completed, to
        // make sure we don't have two copies of controller.run() executing
        // at the same time.
        setTimeout(queuedMoveTimeForward, intervalMillis);
      }
    },
  );

  // now let the bootstrap functions run
  await processKernel();

  return {
    deliverInboundToMbx: queuedDeliverInboundToMbx,
    deliverInboundCommand: queuedDeliverInboundCommand,
    deliverOutbound,
    startTimer: interval => {
      intervalMillis = interval;
      setTimeout(queuedMoveTimeForward, intervalMillis);
    },
    resetOutdatedState: withInputQueue(() => {
      plugin.reset();
      return processKernel();
    }),
  };
}

export default async function start(basedir, argv) {
  const mailboxStateFile = path.resolve(
    basedir,
    'swingset-kernel-mailbox.json',
  );
  const connections = JSON.parse(
    fs.readFileSync(path.join(basedir, 'connections.json')),
  );

  let broadcastJSON;
  function broadcast(obj) {
    if (broadcastJSON) {
      broadcastJSON(obj);
    } else {
      log.error(`Called broadcast before HTTP listener connected.`);
    }
  }

  const { wallet, defaultManagerType } = JSON.parse(
    fs.readFileSync('options.json', 'utf-8'),
  );

  const stateDBDir = path.join(basedir, 'swingset-kernel-state');

  // FIXME: Replace this functionality with per-connection bootstrap code.
  const getLegacyGCI = () => {
    for (const c of connections) {
      switch (c.type) {
        case 'chain-cosmos-sdk':
        case 'fake-chain':
          return { FIXME_GCI: c.GCI };
        default:
      }
    }
    return undefined;
  };

  const d = await buildSwingset(
    stateDBDir,
    mailboxStateFile,
    { ...getLegacyGCI(), ...argv },
    broadcast,
    defaultManagerType,
  );

  const {
    deliverInboundToMbx,
    deliverInboundCommand,
    deliverOutbound,
    startTimer,
    resetOutdatedState,
  } = d;

  // Start timer here!
  startTimer(800);
  resetOutdatedState();

  // Remove wallet traces.
  await unlink('html/wallet').catch(_ => {});

  // Symlink the wallet.
  const pjs = new URL(
    await importMetaResolve(`${wallet}/package.json`, import.meta.url),
  ).pathname;
  const {
    'agoric-wallet': {
      htmlBasedir = 'ui/build',
      deploy = ['contract/deploy.js', 'api/deploy.js'],
    } = {},
  } = JSON.parse(fs.readFileSync(pjs, 'utf-8'));

  const agWallet = path.dirname(pjs);
  const agWalletHtml = path.resolve(agWallet, htmlBasedir);
  symlink(agWalletHtml, 'html/wallet', 'junction').catch(e => {
    console.error('Cannot link html/wallet:', e);
  });

  let hostport;
  await Promise.all(
    connections.map(async c => {
      switch (c.type) {
        case 'chain-cosmos-sdk':
          {
            log(`adding follower/sender for GCI ${c.GCI}`);
            // c.rpcAddresses are strings of host:port for the RPC ports of several
            // chain nodes
            const deliverator = await connectToChain(
              basedir,
              c.GCI,
              c.rpcAddresses,
              c.myAddr,
              deliverInboundToMbx,
              c.chainID,
            );
            addDeliveryTarget(c.GCI, deliverator);
          }
          break;
        case 'fake-chain': {
          log(`adding follower/sender for fake chain ${c.GCI}`);
          const deliverator = await connectToFakeChain(
            basedir,
            c.GCI,
            c.fakeDelay,
            deliverInboundToMbx,
          );
          addDeliveryTarget(c.GCI, deliverator);
          break;
        }
        case 'http':
          log(`adding HTTP/WS listener on ${c.host}:${c.port}`);
          assert(!broadcastJSON, X`duplicate type=http in connections.json`);
          hostport = `${c.host}:${c.port}`;
          broadcastJSON = await makeHTTPListener(
            basedir,
            c.port,
            c.host,
            deliverInboundCommand,
          );
          break;
        default:
          assert.fail(X`unknown connection type in ${c}`);
      }
    }),
  );

  log.info(`swingset running`);
  swingSetRunning = true;
  deliverOutbound();

  const whenHellFreezesOver = new Promise(() => {});
  if (!hostport) {
    return whenHellFreezesOver;
  }

  const deploys = typeof deploy === 'string' ? [deploy] : deploy;
  // TODO: Shell-quote the deploy list.
  const agWalletDeploy = deploys
    .map(dep => path.resolve(agWallet, dep))
    .join(' ');

  const agoricCli = new URL(
    await importMetaResolve('agoric/bin/agoric', import.meta.url),
  ).pathname;

  // Use the same verbosity as our caller did for us.
  let verbosity;
  if (process.env.DEBUG === undefined) {
    verbosity = [];
  } else if (process.env.DEBUG.includes('agoric')) {
    verbosity = ['-vv'];
  } else {
    verbosity = ['-v'];
  }

  // Launch the agoric wallet deploys (if any).  The assumption is that the CLI
  // runs correctly under the same version of the JS engine we're currently
  // using.
  const cp = fork(
    agoricCli,
    [
      `deploy`,
      ...verbosity,
      `--provide=wallet`,
      `--hostport=${hostport}`,
      `${agWalletDeploy}`,
    ],
    { stdio: 'inherit' },
    err => {
      if (err) {
        console.error(err);
      }
      // eslint-disable-next-line no-use-before-define
      process.off('exit', killDeployment);
    },
  );
  const killDeployment = () => cp.kill('SIGINT');
  process.on('exit', killDeployment);

  return whenHellFreezesOver.then(() => cp.kill('SIGINT'));
}
