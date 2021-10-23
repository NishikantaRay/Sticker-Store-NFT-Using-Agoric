import { assert, details as X } from '@agoric/assert';
import { assertKnownOptions } from '../../assertOptions.js';
import { makeLocalVatManagerFactory } from './manager-local.js';
import { makeNodeWorkerVatManagerFactory } from './manager-nodeworker.js';
import { makeNodeSubprocessFactory } from './manager-subprocess-node.js';
import { makeXsSubprocessFactory } from './manager-subprocess-xsnap.js';

export function makeVatManagerFactory({
  allVatPowers,
  kernelKeeper,
  vatEndowments,
  makeNodeWorker,
  startSubprocessWorkerNode,
  startXSnap,
  gcTools,
  defaultManagerType,
  kernelSlog,
}) {
  const localFactory = makeLocalVatManagerFactory({
    allVatPowers,
    kernelKeeper,
    vatEndowments,
    gcTools,
    kernelSlog,
  });

  const nodeWorkerFactory = makeNodeWorkerVatManagerFactory({
    makeNodeWorker,
    kernelKeeper,
    kernelSlog,
    testLog: allVatPowers.testLog,
  });

  const nodeSubprocessFactory = makeNodeSubprocessFactory({
    startSubprocessWorker: startSubprocessWorkerNode,
    kernelKeeper,
    kernelSlog,
    testLog: allVatPowers.testLog,
  });

  const xsWorkerFactory = makeXsSubprocessFactory({
    startXSnap,
    kernelKeeper,
    kernelSlog,
    allVatPowers,
    testLog: allVatPowers.testLog,
  });

  function validateManagerOptions(managerOptions) {
    assertKnownOptions(managerOptions, [
      'consensusMode',
      'enablePipelining',
      'managerType',
      'gcEveryCrank',
      'setup',
      'bundle',
      'metered',
      'enableDisavow',
      'enableSetup',
      'liveSlotsConsole',
      'enableVatstore',
      'virtualObjectCacheSize',
      'useTranscript',
      'vatParameters',
      'vatConsole',
      'name',
      'compareSyscalls',
    ]);
    const { setup, bundle, enableSetup = false } = managerOptions;
    assert(setup || bundle);
    assert(
      !bundle || typeof bundle === 'object',
      `bundle must be object, not a plain string`,
    );
    // todo maybe useless
    assert(!(setup && !enableSetup), X`setup() provided, but not enabled`);
  }

  // returns promise for new vatManager
  function vatManagerFactory(vatID, managerOptions, vatSyscallHandler) {
    validateManagerOptions(managerOptions);
    const {
      managerType = defaultManagerType,
      setup,
      bundle,
      metered,
      enableSetup,
    } = managerOptions;

    if (
      metered &&
      managerType !== 'local' &&
      managerType !== 'xs-worker' &&
      managerType !== 'xs-worker-no-gc'
    ) {
      console.warn(`TODO: support metered with ${managerType}`);
    }
    if (setup && managerType !== 'local') {
      console.warn(`TODO: stop using setup() with ${managerType}`);
    }
    if (managerType === 'local' || enableSetup) {
      if (setup) {
        return localFactory.createFromSetup(
          vatID,
          setup,
          managerOptions,
          vatSyscallHandler,
        );
      }
      return localFactory.createFromBundle(
        vatID,
        bundle,
        managerOptions,
        vatSyscallHandler,
      );
    }

    if (managerType === 'nodeWorker') {
      return nodeWorkerFactory.createFromBundle(
        vatID,
        bundle,
        managerOptions,
        vatSyscallHandler,
      );
    }

    if (managerType === 'node-subprocess') {
      return nodeSubprocessFactory.createFromBundle(
        vatID,
        bundle,
        managerOptions,
        vatSyscallHandler,
      );
    }

    if (managerType === 'xs-worker' || managerType === 'xs-worker-no-gc') {
      const transformedOptions = {
        ...managerOptions,
        managerType: 'xs-worker',
      };
      if (managerOptions.gcEveryCrank === undefined) {
        // Explicitly enable/disable gcEveryCrank.
        transformedOptions.gcEveryCrank = managerType !== 'xs-worker-no-gc';
      }
      return xsWorkerFactory.createFromBundle(
        vatID,
        bundle,
        transformedOptions,
        vatSyscallHandler,
      );
    }

    throw Error(
      `unknown type ${managerType}, not local/nodeWorker/node-subprocess`,
    );
  }

  return harden(vatManagerFactory);
}
