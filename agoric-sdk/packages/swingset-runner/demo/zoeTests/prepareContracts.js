// TODO Remove babel-standalone preinitialization
// https://github.com/endojs/endo/issues/768
import '@agoric/babel-standalone';
import '@agoric/install-ses';
import bundleSource from '@agoric/bundle-source';
import { resolve as importMetaResolve } from 'import-meta-resolve';

import fs from 'fs';

const CONTRACT_FILES = [
  'automaticRefund',
  'autoswap',
  'coveredCall',
  {
    contractPath: 'auction/secondPriceAuction',
    bundleName: 'secondPriceAuction',
  },
  'atomicSwap',
  'simpleExchange',
  'sellItems',
  'mintAndSellNFT',
  'otcDesk',
];

const generateBundlesP = Promise.all(
  CONTRACT_FILES.map(async settings => {
    let bundleName;
    let contractPath;
    if (typeof settings === 'string') {
      bundleName = settings;
      contractPath = settings;
    } else {
      ({ bundleName, contractPath } = settings);
    }
    const sourceUrl = await importMetaResolve(
      `@agoric/zoe/src/contracts/${contractPath}`,
      import.meta.url,
    );
    const sourcePath = new URL(sourceUrl).pathname;
    const bundle = await bundleSource(sourcePath);
    const obj = { bundle, bundleName };
    fs.writeFileSync(
      new URL(`bundle-${bundleName}.js`, import.meta.url).pathname,
      `export default ${JSON.stringify(obj)};`,
    );
  }),
);

generateBundlesP.then(() => console.log('contracts prepared'));
