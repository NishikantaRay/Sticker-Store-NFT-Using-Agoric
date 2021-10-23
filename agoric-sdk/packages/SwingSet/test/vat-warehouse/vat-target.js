import { Far } from '@agoric/marshal';

export function buildRootObject(_vatPowers, _vatParameters) {
  const contents = [];
  function append(thing) {
    contents.push(thing);
    return harden([...contents]);
  }

  const target = Far('root', {
    append,
  });

  return target;
}
