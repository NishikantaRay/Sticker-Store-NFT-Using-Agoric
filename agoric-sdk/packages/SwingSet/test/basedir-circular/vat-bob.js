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
  let p2;
  let r2;
  return Far('root', {
    genPromise1() {
      [p1, r1] = makePR();
      return p1;
    },
    genPromise2() {
      [p2, r2] = makePR();
      return p2;
    },
    usePromises(pa, pb) {
      r1(pb);
      r2(pa);
    },
  });
}
