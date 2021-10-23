import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';

const log = console.log;

export function buildRootObject(_vatPowers) {
  return Far('root', {
    sendPromiseTo(other) {
      log('=> Alice: sendPromiseTo() begins');
      let resolver;
      const param = new Promise((theResolver, _theRejector) => {
        resolver = theResolver;
      });
      const response = E(other).thisIsYourPromise(param);
      resolver('Alice says hi!');
      response.then(
        r => log(`=> Alice: response to thisIsYourPromise resolved to '${r}'`),
        e => log(`=> Alice: response to thisIsYourPromise rejected as '${e}'`),
      );
      log('=> Alice: sendPromiseTo() done');
      return 'Alice started';
    },
  });
}
