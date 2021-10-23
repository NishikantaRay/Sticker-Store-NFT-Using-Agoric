import { E } from '@agoric/eventual-send';
import { makePromiseKit } from '@agoric/promise-kit';

import { evalContractBundle } from '@agoric/zoe/src/contractFacet/evalContractCode.js';

export default harden({
  createMeter: () => {},
  createUnlimitedMeter: () => {},
  createVat: bundle => {
    return harden({
      root: E(evalContractBundle(bundle)).buildRootObject(),
      adminNode: {
        done: () => {
          return makePromiseKit().promise;
        },
        terminate: () => {},
      },
    });
  },
  createVatByName: _name => {
    throw Error(`createVatByName not supported in fake mode`);
  },
});
