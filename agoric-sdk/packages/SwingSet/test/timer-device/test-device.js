import { test } from '../../tools/prepare-test-env-ava.js';

// eslint-disable-next-line import/order
import { provideHostStorage } from '../../src/hostStorage.js';

import { initializeSwingset, makeSwingsetController } from '../../src/index.js';
import { buildTimer } from '../../src/devices/timer.js';

const TimerSrc = new URL('../../src/devices/timer-src.js', import.meta.url)
  .pathname;

const timerConfig = {
  bootstrap: 'bootstrap',
  vats: {
    bootstrap: {
      sourceSpec: new URL('bootstrap.js', import.meta.url).pathname,
    },
  },
  devices: {
    timer: {
      sourceSpec: TimerSrc,
    },
  },
};

test('wake', async t => {
  const timer = buildTimer();
  const deviceEndowments = {
    timer: { ...timer.endowments },
  };
  const hostStorage = provideHostStorage();

  await initializeSwingset(timerConfig, ['timer'], hostStorage);
  const c = await makeSwingsetController(hostStorage, deviceEndowments);
  timer.poll(1);
  await c.run();
  timer.poll(5);
  await c.run();
  t.deepEqual(c.dump().log, ['starting wake test', 'handler.wake()']);
});

test('repeater', async t => {
  const timer = buildTimer();
  const deviceEndowments = {
    timer: { ...timer.endowments },
  };
  const hostStorage = provideHostStorage();

  await initializeSwingset(timerConfig, ['repeater', 3, 2], hostStorage);
  const c = await makeSwingsetController(hostStorage, deviceEndowments);
  timer.poll(1);
  await c.run();
  timer.poll(5);
  await c.run();
  t.deepEqual(c.dump().log, [
    'starting repeater test',
    'next scheduled time: 3',
    'handler.wake(3) called 1 times.',
  ]);
});

test('repeater2', async t => {
  const timer = buildTimer();
  const deviceEndowments = {
    timer: { ...timer.endowments },
  };
  const hostStorage = provideHostStorage();

  await initializeSwingset(timerConfig, ['repeater', 3, 2], hostStorage);
  const c = await makeSwingsetController(hostStorage, deviceEndowments);
  timer.poll(1n);
  await c.run();
  timer.poll(5n);
  await c.run();
  timer.poll(8n);
  await c.run();
  t.deepEqual(c.dump().log, [
    'starting repeater test',
    'next scheduled time: 3',
    'handler.wake(3) called 1 times.',
    'handler.wake(7) called 2 times.',
  ]);
});

test('repeaterZero', async t => {
  const timer = buildTimer();
  const deviceEndowments = {
    timer: { ...timer.endowments },
  };
  const hostStorage = provideHostStorage();

  await initializeSwingset(timerConfig, ['repeater', 0, 3], hostStorage);
  const c = await makeSwingsetController(hostStorage, deviceEndowments);
  timer.poll(1);
  await c.run();
  timer.poll(2);
  await c.run();
  timer.poll(3);
  await c.run();
  timer.poll(4);
  await c.run();
  timer.poll(5);
  await c.run();
  timer.poll(6);
  await c.run();
  timer.poll(7);
  await c.run();
  timer.poll(8);
  await c.run();
  timer.poll(9);
  await c.run();
  timer.poll(10);
  await c.run();
  t.deepEqual(c.dump().log, [
    'starting repeater test',
    'next scheduled time: 3',
    'handler.wake(3) called 1 times.',
    'handler.wake(6) called 2 times.',
    'handler.wake(9) called 3 times.',
  ]);
});
