import { Far } from '@agoric/marshal';

function makePR() {
  let r;
  const p = new Promise((resolve, _reject) => {
    r = resolve;
  });
  return [p, r];
}

export function buildRootObject(_vatPowers) {
  const rs = new Map();
  return Far('root', {
    genPromise(idx) {
      const [p, r] = makePR();
      rs.set(idx, r);
      return p;
    },
    usePromise(idx, p) {
      const r = rs.get(idx);
      r(p);
    },
  });
}
