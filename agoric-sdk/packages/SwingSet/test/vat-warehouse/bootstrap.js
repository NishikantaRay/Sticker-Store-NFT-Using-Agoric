import { Far } from '@agoric/marshal';

export function buildRootObject() {
  let vatStrongRef;
  return Far('root', {
    bootstrap(vats, _devices) {
      // eslint-disable-next-line no-unused-vars
      vatStrongRef = vats;
    },
  });
}
