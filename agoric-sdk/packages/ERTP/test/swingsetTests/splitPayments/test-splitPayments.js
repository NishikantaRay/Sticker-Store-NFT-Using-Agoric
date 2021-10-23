// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/swingset-vat/tools/prepare-test-env-ava.js';

// eslint-disable-next-line import/no-extraneous-dependencies
import { loadBasedir, buildVatController } from '@agoric/swingset-vat';

async function main(basedir, argv) {
  const dir = new URL(`../${basedir}/`, import.meta.url).pathname;
  const config = await loadBasedir(dir);
  config.defaultManagerType = 'xs-worker';
  const controller = await buildVatController(config, argv);
  await controller.run();
  return controller.dump();
}

const expectedTapFaucetLog = [
  'start test splitPayments',
  'oldPayment balance:{"brand":{},"value":1000}',
  'splitPayment[0] balance: {"brand":{},"value":10}',
  'splitPayment[1] balance: {"brand":{},"value":990}',
];

test('test splitPayments', async t => {
  const dump = await main('splitPayments', ['splitPayments']);
  t.deepEqual(dump.log, expectedTapFaucetLog);
});
