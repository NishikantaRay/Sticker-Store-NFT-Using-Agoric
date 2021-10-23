/* global Buffer process */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

import { assert, details as X } from '@agoric/assert';
import anylogger from 'anylogger';
import { HELPER } from './chain-cosmos-sdk.js';

const log = anylogger('ag-solo:init');

const DEFAULT_WALLET = '@agoric/dapp-svelte-wallet';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

export default function initBasedir(
  basedir,
  webport,
  webhost,
  subdir,
  egresses,
  opts = {},
) {
  const { env = process.environment } = opts;
  const {
    wallet = DEFAULT_WALLET,
    defaultManagerType = env.SWINGSET_WORKER_TYPE || 'xs-worker',
    ...options
  } = opts;
  options.wallet = wallet;
  options.defaultManagerType = defaultManagerType;

  // We either need a basedir with an initialised key, or no basedir.
  assert(
    fs.existsSync(path.join(basedir, 'ag-cosmos-helper-address')) ||
      !fs.existsSync(basedir),
    X`${basedir} must not already exist`,
  );

  fs.mkdirSync(basedir, { mode: 0o700, recursive: true });

  const connections = [{ type: 'http', port: webport, host: webhost }];
  fs.writeFileSync(
    path.join(basedir, 'connections.json'),
    `${JSON.stringify(connections)}\n`,
  );
  const dstHtmldir = path.join(basedir, 'html');
  fs.mkdirSync(dstHtmldir);

  // Save the configuration options.
  fs.writeFileSync(path.join(basedir, 'options.json'), JSON.stringify(options));

  // Save our version codes.
  const pj = 'package.json';
  fs.copyFileSync(path.join(dirname, '..', pj), path.join(dstHtmldir, pj));
  const gr = 'git-revision.txt';
  try {
    fs.copyFileSync(
      path.join(dirname, '../public', gr),
      path.join(dstHtmldir, gr),
    );
  } catch (e) {
    let revision;
    try {
      // Don't allow git to fail.
      revision = execFileSync('git', ['describe', '--always', '--dirty']);
    } catch (_e) {
      revision = 'unknown\n';
    }
    fs.writeFileSync(path.join(dstHtmldir, gr), revision);
  }

  // cosmos-sdk keypair
  if (egresses.includes('cosmos')) {
    const agchServerDir = path.join(basedir, 'ag-cosmos-helper-statedir');
    if (!fs.existsSync(agchServerDir)) {
      fs.mkdirSync(agchServerDir);
      const keyName = 'ag-solo';
      // we suppress stderr because it displays the mnemonic phrase, but
      // unfortunately that means errors are harder to diagnose
      execFileSync(
        HELPER,
        [
          'keys',
          'add',
          '--keyring-backend=test',
          keyName,
          '--home',
          agchServerDir,
        ],
        {
          input: Buffer.from(''),
          stdio: ['pipe', 'ignore', 'ignore'],
        },
      );
      log('key generated, now extracting address');
      const kout = execFileSync(
        HELPER,
        [
          'keys',
          'show',
          '--keyring-backend=test',
          keyName,
          '--address',
          '--home',
          agchServerDir,
        ],
        {
          input: Buffer.from(''),
          stdio: ['pipe', 'pipe', 'inherit'],
        },
      );
      fs.writeFileSync(
        path.join(basedir, 'ag-cosmos-helper-address'),
        kout.toString(),
      );
    }
  }

  // this marker file is how we recognize ag-solo basedirs
  fs.copyFileSync(
    path.join(dirname, '..', 'solo-README-to-install.md'),
    path.join(basedir, 'solo-README.md'),
  );

  log(`ag-solo initialized in ${basedir}`);
  log(`HTTP/WebSocket will listen on ${webhost}:${webport}`);
}
