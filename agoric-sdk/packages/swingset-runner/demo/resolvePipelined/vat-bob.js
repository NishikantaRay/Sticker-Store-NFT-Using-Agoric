import { Far } from '@agoric/marshal';

const log = console.log;

export function buildRootObject(_vatPowers) {
  const thing = Far('thing', {
    second() {
      log('=> Bob: in thing.second(), reply with string');
      return `Bob's second answer`;
    },
  });
  return Far('root', {
    first() {
      log('=> Bob: in first(), reply with thing');
      return thing;
    },
  });
}
