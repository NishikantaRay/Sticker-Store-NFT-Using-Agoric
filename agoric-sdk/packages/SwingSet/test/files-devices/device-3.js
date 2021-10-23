import { Far } from '@agoric/marshal';

export function buildRootDeviceNode({
  setDeviceState,
  getDeviceState,
  testLog,
}) {
  testLog(typeof getDeviceState());

  return Far('root', {
    setState(arg) {
      setDeviceState(arg);
      return 'ok';
    },
    getState() {
      return harden(getDeviceState());
    },
  });
}
