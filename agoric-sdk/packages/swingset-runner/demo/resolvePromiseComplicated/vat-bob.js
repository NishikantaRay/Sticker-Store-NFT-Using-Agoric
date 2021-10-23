import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';

const log = console.log;

export function buildRootObject(_vatPowers) {
  let resolver;
  let carol;
  return Far('root', {
    first(carolVat) {
      log('=> Bob: in first');
      const answer = new Promise((theResolver, _theRejector) => {
        resolver = theResolver;
      });
      carol = carolVat;
      return answer;
    },
    second(p) {
      log('=> Bob: second begins');
      resolver('Bob answers first in second');
      log('=> Bob: send p to carol.foo');
      E(carol).foo(p);
      p.then(
        r => log(`=> Bob: the parameter to second resolved to '${r}'`),
        e => log(`=> Bob: the parameter to second rejected as '${e}'`),
      );
      Promise.resolve().then(E(carol).bar(p));
      log('=> Bob: second done');
      return `Bob's second answer`;
    },
  });
}
