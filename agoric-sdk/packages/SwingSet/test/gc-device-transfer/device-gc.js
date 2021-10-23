import { Far } from '@agoric/marshal';

export function buildRootDeviceNode({ setDeviceState }) {
  let stash;
  return Far('root', {
    set(arg) {
      setDeviceState(arg);
      stash = arg;
    },
    get() {
      return stash;
    },
  });
}
