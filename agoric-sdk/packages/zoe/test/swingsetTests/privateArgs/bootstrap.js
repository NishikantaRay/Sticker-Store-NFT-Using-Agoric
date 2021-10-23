import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';

export function buildRootObject(vatPowers, vatParameters) {
  const { contractBundles: cb } = vatParameters;
  return Far('root', {
    async bootstrap(vats, devices) {
      const vatAdminSvc = await E(vats.vatAdmin).createVatAdminService(
        devices.vatAdmin,
      );
      const zoe = await E(vats.zoe).buildZoe(vatAdminSvc);
      const installations = {
        privateArgsUsageContract: await E(zoe).install(
          cb.privateArgsUsageContract,
        ),
      };

      const aliceP = E(vats.alice).build(zoe, installations);
      await E(aliceP).privateArgsUsageTest();
    },
  });
}
