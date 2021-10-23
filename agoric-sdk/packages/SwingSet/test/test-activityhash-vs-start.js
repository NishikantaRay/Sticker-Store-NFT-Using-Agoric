// eslint-disable-next-line import/order
import { test } from '../tools/prepare-test-env-ava.js';

// eslint-disable-next-line import/order
import { getAllState, setAllState } from '@agoric/swing-store';
import { provideHostStorage } from '../src/hostStorage.js';
import { initializeSwingset, makeSwingsetController } from '../src/index.js';
import { capargs } from './util.js';
import { buildTimer } from '../src/devices/timer.js';

const TimerSrc = new URL('../src/devices/timer-src.js', import.meta.url)
  .pathname;

test('restarting kernel does not change activityhash', async t => {
  const sourceSpec = new URL('vat-empty-setup.js', import.meta.url).pathname;
  const config = {
    bootstrap: 'bootstrap',
    vats: {
      bootstrap: {
        sourceSpec,
        creationOptions: {
          enableSetup: true,
        },
      },
    },
    devices: {
      timer: {
        sourceSpec: TimerSrc,
      },
    },
  };
  const timer1 = buildTimer();
  const deviceEndowments1 = {
    timer: { ...timer1.endowments },
  };
  const hs1 = provideHostStorage();
  // console.log(`--c1 build`);
  await initializeSwingset(config, [], hs1);
  const c1 = await makeSwingsetController(hs1, deviceEndowments1);
  c1.pinVatRoot('bootstrap');
  // console.log(`--c1 poll1`);
  timer1.poll(1);
  // console.log(`--c1 run1`);
  await c1.run();

  // console.log(`--c1 getAllState`);
  const state = getAllState(hs1);
  // console.log(`ah: ${c1.getActivityhash()}`);

  // console.log(`--c1 poll1`);
  timer1.poll(2);
  // console.log(`--c1 run2`);
  await c1.run();

  // console.log(`--c1 dummy()`);
  c1.queueToVatRoot('bootstrap', 'dummy', capargs([]));
  // console.log(`--c1 run3`);
  await c1.run();
  const c1ah = c1.getActivityhash();
  await c1.shutdown();
  // console.log(`--c1 shutdown`);

  // a kernel restart is loading a new kernel from the same state
  const timer2 = buildTimer();
  const deviceEndowments2 = {
    timer: { ...timer2.endowments },
  };
  const hs2 = provideHostStorage();
  setAllState(hs2, state);
  // console.log(`--c2 build`);
  const c2 = await makeSwingsetController(hs2, deviceEndowments2);
  // console.log(`ah: ${c2.getActivityhash()}`);

  // console.log(`--c2 poll1`);
  timer2.poll(2);
  // console.log(`--c2 run2`);
  await c2.run();

  // console.log(`--c2 dummy()`);
  c2.queueToVatRoot('bootstrap', 'dummy', capargs([]));
  // console.log(`--c2 run3`);
  await c2.run();

  const c2ah = c2.getActivityhash();
  await c2.shutdown();

  t.is(c1ah, c2ah);
});

test('comms initialize is deterministic', async t => {
  // bug #3726: comms was calling vatstoreGet('initialize') and
  // vatstoreSet('meta.o+0') during the first message after process restart,
  // which makes it a nondeterministic function of the input events.

  const sourceSpec = new URL('vat-activityhash-comms.js', import.meta.url)
    .pathname;
  const config = {};
  config.bootstrap = 'bootstrap';
  config.vats = { bootstrap: { sourceSpec } };
  const hs1 = provideHostStorage();
  await initializeSwingset(config, [], hs1);
  const c1 = await makeSwingsetController(hs1, {});
  c1.pinVatRoot('bootstrap');
  // the bootstrap message will cause comms to initialize itself
  await c1.run();

  const state = getAllState(hs1);

  // but the second message should not
  c1.queueToVatRoot('bootstrap', 'addRemote', capargs(['remote2']));
  await c1.run();
  const c1ah = c1.getActivityhash();
  await c1.shutdown();

  // a kernel restart is loading a new kernel from the same state
  const hs2 = provideHostStorage();
  setAllState(hs2, state);
  const c2 = await makeSwingsetController(hs2, {});

  // the "am I already initialized?" check must be identical to the
  // non-restarted version

  c2.queueToVatRoot('bootstrap', 'addRemote', capargs(['remote2']));
  await c2.run();
  const c2ah = c2.getActivityhash();
  await c2.shutdown();

  t.is(c1ah, c2ah);
});
