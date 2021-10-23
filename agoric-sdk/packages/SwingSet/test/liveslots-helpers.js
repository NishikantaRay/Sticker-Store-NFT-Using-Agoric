import engineGC from '../src/engine-gc.js';

import { WeakRef, FinalizationRegistry } from '../src/weakref.js';
import { waitUntilQuiescent } from '../src/waitUntilQuiescent.js';
import { makeGcAndFinalize } from '../src/gc-and-finalize.js';
import { makeDummyMeterControl } from '../src/kernel/dummyMeterControl.js';
import { makeLiveSlots } from '../src/kernel/liveSlots.js';

export function buildSyscall() {
  const log = [];
  const fakestore = new Map();

  const syscall = {
    send(targetSlot, method, args, resultSlot) {
      log.push({ type: 'send', targetSlot, method, args, resultSlot });
    },
    subscribe(target) {
      log.push({ type: 'subscribe', target });
    },
    resolve(resolutions) {
      log.push({ type: 'resolve', resolutions });
    },
    dropImports(slots) {
      log.push({ type: 'dropImports', slots });
    },
    retireImports(slots) {
      log.push({ type: 'retireImports', slots });
    },
    retireExports(slots) {
      log.push({ type: 'retireExports', slots });
    },
    exit(isFailure, info) {
      log.push({ type: 'exit', isFailure, info });
    },
    vatstoreGet(key) {
      log.push({ type: 'vatstoreGet', key });
      return fakestore.get(key);
    },
    vatstoreSet(key, value) {
      log.push({ type: 'vatstoreSet', key, value });
      fakestore.set(key, value);
    },
    vatstoreDelete(key) {
      log.push({ type: 'vatstoreDelete', key });
      fakestore.delete(key);
    },
  };

  return { log, syscall };
}

export function makeDispatch(
  syscall,
  build,
  vatID = 'vatA',
  enableDisavow = false,
  cacheSize = undefined,
  returnTestHooks = undefined,
) {
  const gcTools = harden({
    WeakRef,
    FinalizationRegistry,
    waitUntilQuiescent,
    gcAndFinalize: makeGcAndFinalize(engineGC),
    meterControl: makeDummyMeterControl(),
  });
  const { setBuildRootObject, dispatch, testHooks } = makeLiveSlots(
    syscall,
    vatID,
    {},
    {},
    cacheSize,
    enableDisavow,
    false,
    gcTools,
  );
  if (returnTestHooks) {
    returnTestHooks[0] = testHooks;
  }
  setBuildRootObject(build);
  return dispatch;
}
