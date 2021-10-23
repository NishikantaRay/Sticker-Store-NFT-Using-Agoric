// @ts-check

// TODO Remove babel-standalone preinitialization
// https://github.com/endojs/endo/issues/768
// eslint-disable-next-line import/no-extraneous-dependencies
import '@agoric/babel-standalone';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@agoric/install-ses';
// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import path from 'path';

import { buildVatController, buildKernelBundles } from '@agoric/swingset-vat';
import bundleSource from '@agoric/bundle-source';

const CONTRACT_FILES = [
  'committee',
  'contractGovernor',
  'binaryVoteCounter',
  {
    contractPath: '/governedContract',
    bundleName: 'governedContract',
  },
];

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

test.before(async t => {
  const start = Date.now();
  const kernelBundles = await buildKernelBundles();
  const step2 = Date.now();
  const contractBundles = {};
  await Promise.all(
    CONTRACT_FILES.map(async settings => {
      let bundleName;
      let contractPath;
      if (typeof settings === 'string') {
        bundleName = settings;
        contractPath = `/../../../src/${settings}`;
      } else {
        ({ bundleName, contractPath } = settings);
      }
      const source = `${dirname}${contractPath}`;
      const bundle = await bundleSource(source);
      contractBundles[bundleName] = bundle;
    }),
  );
  const step3 = Date.now();

  const vats = {};
  await Promise.all(
    ['voter', 'zoe'].map(async name => {
      const source = `${dirname}/vat-${name}.js`;
      const bundle = await bundleSource(source);
      vats[name] = { bundle };
    }),
  );
  const bootstrapSource = `${dirname}/bootstrap.js`;
  vats.bootstrap = {
    bundle: await bundleSource(bootstrapSource),
    parameters: { contractBundles }, // argv will be added to this
  };
  const config = { bootstrap: 'bootstrap', vats };
  config.defaultManagerType = 'xs-worker';

  const step4 = Date.now();
  const ktime = `${(step2 - start) / 1000}s kernel`;
  const ctime = `${(step3 - step2) / 1000}s contracts`;
  const vtime = `${(step4 - step3) / 1000}s vats`;
  const ttime = `${(step4 - start) / 1000}s total`;
  console.log(`bundling: ${ktime}, ${ctime}, ${vtime}, ${ttime}`);

  // @ts-ignore
  t.context.data = { kernelBundles, config };
});

const main = async (t, argv) => {
  const { kernelBundles, config } = t.context.data;
  const controller = await buildVatController(config, argv, { kernelBundles });
  await controller.run();
  return controller.dump();
};

const expectedcontractGovernorStartLog = [
  '=> voter and electorate vats are set up',
  '@@ schedule task for:3, currently: 0 @@',
  'Voter Alice voted for {"changeParam":{"key":"main","parameterName":"MalleableNumber"},"proposedValue":"[299792458n]"}',
  'Voter Bob voted for {"noChange":{"key":"main","parameterName":"MalleableNumber"}}',
  'Voter Carol voted for {"noChange":{"key":"main","parameterName":"MalleableNumber"}}',
  'Voter Dave voted for {"changeParam":{"key":"main","parameterName":"MalleableNumber"},"proposedValue":"[299792458n]"}',
  'Voter Emma voted for {"changeParam":{"key":"main","parameterName":"MalleableNumber"},"proposedValue":"[299792458n]"}',
  '@@ tick:1 @@',
  '@@ tick:2 @@',
  '@@ tick:3 @@',
  '&& running a task scheduled for 3. &&',
  'vote outcome: {"changeParam":{"key":"main","parameterName":"MalleableNumber"},"proposedValue":"[299792458n]"}',
  'updated to "[299792458n]"',
  'MalleableNumber was changed to "[602214090000000000000000n]"',
  'current value of MalleableNumber is 299792458',
  'Voter Alice validated all the things',
];

test('zoe - contract governance', async t => {
  const dump = await main(t, ['contractGovernorStart']);
  t.deepEqual(dump.log, expectedcontractGovernorStartLog);
});
