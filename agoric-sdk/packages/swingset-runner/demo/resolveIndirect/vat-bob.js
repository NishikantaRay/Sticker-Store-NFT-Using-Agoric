import { Far } from '@agoric/marshal';

function makePR() {
  let r;
  const p = new Promise((resolve, _reject) => {
    r = resolve;
  });
  return [p, r];
}

export function buildRootObject(_vatPowers) {
  let p1;
  let r1;
  return Far('root', {
    genPromise1() {
      return 'Hello!';
    },
    genPromise2() {
      [p1, r1] = makePR();
      return p1;
    },
    usePromise(pa) {
      r1(pa);
    },
  });
}
