import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';

const build = async (log, zoe, installations) => {
  return Far('build', {
    minimalMakeKindTest: async () => {
      const result = await E(zoe).startInstance(installations.minimalMakeKind);
      log(result);
    },
  });
};

export function buildRootObject(vatPowers) {
  return Far('root', {
    build: (...args) => build(vatPowers.testLog, ...args),
  });
}
