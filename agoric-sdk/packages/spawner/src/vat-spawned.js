/* global globalThis */

import { importBundle } from '@agoric/import-bundle';
import { Far } from '@agoric/marshal';

const endowments = {
  console,
  assert,
  Base64: globalThis.Base64, // Present only on XSnap
  URL: globalThis.URL, // Absent only on XSnap
};

export function buildRootObject() {
  return Far('root', {
    async loadBundle(bundle) {
      const ns = await importBundle(bundle, { endowments });
      const startFn = ns.default;
      return Far('spawned bundle', {
        async start(argsP) {
          const args = await argsP;
          return startFn(args);
        },
      });
    },
  });
}
