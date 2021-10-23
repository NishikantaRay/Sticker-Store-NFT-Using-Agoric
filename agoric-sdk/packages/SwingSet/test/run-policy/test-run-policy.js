import { test } from '../../tools/prepare-test-env-ava.js';

// eslint-disable-next-line import/order
import { provideHostStorage } from '../../src/hostStorage.js';
import { initializeSwingset, makeSwingsetController } from '../../src/index.js';
import { capargsOneSlot, capSlot, capargs } from '../util.js';
import {
  crankCounter,
  computronCounter,
  wallClockWaiter,
} from '../../src/runPolicies.js';

async function testCranks(t, mode) {
  const config = {
    vats: {
      left: {
        sourceSpec: new URL('vat-policy-left.js', import.meta.url).pathname,
      },
      right: {
        sourceSpec: new URL('vat-policy-right.js', import.meta.url).pathname,
        creationOptions: {
          enableVatstore: true,
        },
      },
    },
    defaultManagerType: 'xs-worker',
  };
  const hostStorage = provideHostStorage();
  await initializeSwingset(config, [], hostStorage);
  const c = await makeSwingsetController(hostStorage);
  c.pinVatRoot('left');
  const rightKref = c.pinVatRoot('right');
  const rightID = c.vatNameToID('right');
  t.teardown(c.shutdown);

  if (mode === 'messages' || mode === 'wallclock') {
    // The 'message' mode sends doMessage() to left, which makes left send
    // doMessage() to right, which makes right send doMessage() to left, etc.
    // This uses four cranks per cycle, since each doMessage() also has a
    // return promise that must be resolved.
    const args = capargs([capSlot(0), 'disabled'], [rightKref]);
    c.queueToVatRoot('left', 'doMessage', args);
  } else if (mode === 'resolutions') {
    // This triggers a back-and-forth cycle of promise resolution, which uses
    // two cranks per cycle. The setup takes three cranks.
    const args = capargsOneSlot(rightKref);
    c.queueToVatRoot('left', 'startPromise', args);
  } else if (mode === 'computrons') {
    // Use doMessage() like above, but once every 10 cycles, do enough extra
    // CPU to trigger a computron-limiting policy.
    const args = capargs([capSlot(0), 0], [rightKref]);
    c.queueToVatRoot('left', 'doMessage', args);
  } else {
    throw Error(`unknown mode ${mode}`);
  }

  let oldCrankNum = parseInt(hostStorage.kvStore.get('crankNumber'), 10);
  function elapsedCranks() {
    const newCrankNum = parseInt(hostStorage.kvStore.get('crankNumber'), 10);
    const elapsed = newCrankNum - oldCrankNum;
    oldCrankNum = newCrankNum;
    return elapsed;
  }

  let more;

  if (mode === 'messages' || mode === 'resolutions') {
    more = await c.run(crankCounter(7, 0));
    t.truthy(more, 'vat was supposed to run forever');
    t.is(elapsedCranks(), 7);

    more = await c.run(crankCounter(1, 0));
    t.truthy(more, 'vat was supposed to run forever');
    t.is(elapsedCranks(), 1);

    more = await c.run(crankCounter(8, 0));
    t.truthy(more, 'vat was supposed to run forever');
    t.is(elapsedCranks(), 8);
  } else if (mode === 'computrons') {
    // the doMessage cycle has four steps:
    // 1: normal delivery (122k-134k computrons)
    // 2: notify (22k computrons)
    // 3: normal delivery
    // 4: notify

    // and takes about 300k per cycle. But every 5th time we do step 3, it
    // does an extra 5.7M computrons. The cumulative computron count just
    // before that point should be about 1.3M, and after should be 7M, so by
    // setting a threshold of 4M, we should finish c.run() just after that
    // extra-compute step.
    await c.run(computronCounter(4_000_000n));
    t.is(elapsedCranks(), 17);
    const ckey = `${rightID}.vs.vvs.seqnum`;
    const seqnum = parseInt(hostStorage.kvStore.get(ckey), 10);
    t.is(seqnum, 5);
  } else if (mode === 'wallclock') {
    const startMS = Date.now();
    // On an idle system, this does about 120 cranks per second when run
    // alone. When the rest of test-run-policy.js is running in parallel, it
    // does about 100 cps.
    more = await c.run(wallClockWaiter(1.0));
    t.truthy(more, 'vat was supposed to run forever');
    const elapsedMS = Date.now() - startMS;
    const elapsed = elapsedMS / 1000;
    // console.log(`elapsed`, elapsed, more);
    t.true(elapsed < 200.0, `time distort: ${elapsed} >= 200.0s`);
  }
}

test('run policy - cranks - messages', t => testCranks(t, 'messages'));
test('run policy - cranks - resolutions', t => testCranks(t, 'resolutions'));
test('run policy - computrons', t => testCranks(t, 'computrons'));
test('run policy - wallclock', t => testCranks(t, 'wallclock'));
