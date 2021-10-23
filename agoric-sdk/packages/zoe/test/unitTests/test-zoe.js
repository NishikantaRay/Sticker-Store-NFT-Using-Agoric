// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import path from 'path';

import { AmountMath } from '@agoric/ertp';
import { E } from '@agoric/eventual-send';
import { makePromiseKit } from '@agoric/promise-kit';
import { passStyleOf } from '@agoric/marshal';

// eslint-disable-next-line import/no-extraneous-dependencies
import bundleSource from '@agoric/bundle-source';

import { setupZCFTest } from './zcf/setupZcfTest.js';
import { setup } from './setupBasicMints.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

test(`zoe.getInvitationIssuer`, async t => {
  const { zoe, zcf } = await setupZCFTest();
  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const invitation = zcf.makeInvitation(undefined, 'invite');

  // A few basic tests that the invitation issuer acts like an issuer.
  // Not exhaustive.
  const brand = await E(invitationIssuer).getBrand();
  const amount = await E(invitationIssuer).getAmountOf(invitation);
  t.is(amount.brand, brand);
  t.truthy(await E(invitationIssuer).isLive(invitation));
  await E(invitationIssuer).burn(invitation);
  t.falsy(await E(invitationIssuer).isLive(invitation));
});

test(`E(zoe).install bad bundle`, async t => {
  const { zoe } = setup();
  // @ts-ignore deliberate invalid arguments for testing
  await t.throwsAsync(() => E(zoe).install(), {
    message: 'a bundle must be provided',
  });
});

test(`E(zoe).install`, async t => {
  const { zoe } = setup();
  const contractPath = `${dirname}/../../src/contracts/atomicSwap`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  // TODO Check the integrity of the installation by its hash.
  // https://github.com/Agoric/agoric-sdk/issues/3859
  // const hash = await E(installation).getHash();
  // assert.is(hash, 'XXX');
  t.is(await E(installation).getBundle(), bundle);
});

test(`E(zoe).startInstance bad installation`, async t => {
  const { zoe } = setup();
  // @ts-ignore deliberate invalid arguments for testing
  await t.throwsAsync(() => E(zoe).startInstance(), {
    message:
      // Should be able to use more informative error once SES double
      // disclosure bug is fixed. See
      // https://github.com/endojs/endo/pull/640
      //
      // /"\[undefined\]" was not a valid installation/,
      /.* was not a valid installation/,
  });
});

function isEmptyFacet(t, facet) {
  t.is(passStyleOf(facet), 'remotable');
  t.deepEqual(Object.getOwnPropertyNames(facet), []);
}

test(`E(zoe).startInstance no issuerKeywordRecord, no terms`, async t => {
  const { zoe, installation } = await setupZCFTest();
  const result = await E(zoe).startInstance(installation);
  // Note that deepEqual treats all empty objects (handles) as interchangeable.
  t.deepEqual(Object.getOwnPropertyNames(result).sort(), [
    'adminFacet',
    'creatorFacet',
    'creatorInvitation',
    'instance',
    'publicFacet',
  ]);
  isEmptyFacet(t, result.creatorFacet);
  t.deepEqual(result.creatorInvitation, undefined);
  isEmptyFacet(t, result.publicFacet);
  t.deepEqual(Object.getOwnPropertyNames(result.adminFacet).sort(), [
    'getVatShutdownPromise',
  ]);
});

test(`E(zoe).startInstance promise for installation`, async t => {
  const { zoe, installation } = await setupZCFTest();
  const {
    promise: installationP,
    resolve: installationPResolve,
  } = makePromiseKit();

  const resultP = E(zoe).startInstance(installationP);
  installationPResolve(installation);

  const result = await resultP;
  // Note that deepEqual treats all empty objects (handles) as interchangeable.
  t.deepEqual(Object.getOwnPropertyNames(result).sort(), [
    'adminFacet',
    'creatorFacet',
    'creatorInvitation',
    'instance',
    'publicFacet',
  ]);
  isEmptyFacet(t, result.creatorFacet);
  t.deepEqual(result.creatorInvitation, undefined);
  isEmptyFacet(t, result.publicFacet);
  t.deepEqual(Object.getOwnPropertyNames(result.adminFacet).sort(), [
    'getVatShutdownPromise',
  ]);
});

test(`E(zoe).startInstance - terms, issuerKeywordRecord switched`, async t => {
  const { zoe, installation } = await setupZCFTest();
  const { moolaKit } = setup();
  await t.throwsAsync(
    () =>
      E(zoe).startInstance(
        installation,
        // @ts-ignore deliberate invalid arguments for testing
        { something: 2 },
        { Moola: moolaKit.issuer },
      ),
    {
      message:
        // Should be able to use more informative error once SES double
        // disclosure bug is fixed. See
        // https://github.com/endojs/endo/pull/640
        //
        // /keyword "something" must be ascii and must start with a capital letter./
        /keyword .* must be ascii and must start with a capital letter./,
    },
  );
});

test(`E(zoe).offer`, async t => {
  const { zoe, zcf } = await setupZCFTest();
  const invitation = zcf.makeInvitation(() => 'result', 'invitation');
  const userSeat = E(zoe).offer(invitation);
  t.is(await E(userSeat).getOfferResult(), 'result');
});

test(`E(zoe).offer - no invitation`, async t => {
  const { zoe } = await setupZCFTest();
  // @ts-ignore deliberate invalid arguments for testing
  await t.throwsAsync(() => E(zoe).offer(), {
    message: /A Zoe invitation is required, not "\[undefined\]"/,
  });
});

test(`E(zoe).getPublicFacet`, async t => {
  const { zoe } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { publicFacet, instance } = await E(zoe).startInstance(installation);
  const offersCount = await E(publicFacet).getOffersCount();
  t.is(offersCount, 0n);
  t.is(await E(zoe).getPublicFacet(instance), publicFacet);
});

test(`E(zoe).getPublicFacet - no instance`, async t => {
  const { zoe } = setup();
  // @ts-ignore deliberate invalid arguments for testing
  await t.throwsAsync(() => E(zoe).getPublicFacet(), {
    message:
      // Should be able to use more informative error once SES double
      // disclosure bug is fixed. See
      // https://github.com/endojs/endo/pull/640
      //
      // /"instance" not found: "\[undefined\]"/,
      /.* not found: "\[undefined\]"/,
  });
});

test(`zoe.getIssuers`, async t => {
  const { zoe, moolaKit } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { instance } = await E(zoe).startInstance(installation, {
    Moola: moolaKit.issuer,
  });
  t.deepEqual(await E(zoe).getIssuers(instance), { Moola: moolaKit.issuer });
});

test(`zoe.getIssuers - none`, async t => {
  const { zoe } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { instance } = await E(zoe).startInstance(installation);
  t.deepEqual(await E(zoe).getIssuers(instance), {});
});

test(`zoe.getIssuers - no instance`, async t => {
  const { zoe } = setup();
  // @ts-ignore invalid arguments for testing
  await t.throwsAsync(() => E(zoe).getIssuers(), {
    message:
      // Should be able to use more informative error once SES double
      // disclosure bug is fixed. See
      // https://github.com/endojs/endo/pull/640
      //
      // /"instance" not found: "\[undefined\]"/,
      /.* not found: "\[undefined\]"/,
  });
});

test(`zoe.getBrands`, async t => {
  const { zoe, moolaKit } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { instance } = await E(zoe).startInstance(installation, {
    Moola: moolaKit.issuer,
  });
  t.deepEqual(await E(zoe).getBrands(instance), { Moola: moolaKit.brand });
});

test(`zoe.getBrands - none`, async t => {
  const { zoe } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { instance } = await E(zoe).startInstance(installation);
  t.deepEqual(await E(zoe).getBrands(instance), {});
});

test(`zoe.getBrands - no instance`, async t => {
  const { zoe } = setup();
  // @ts-ignore invalid arguments for testing
  await t.throwsAsync(() => E(zoe).getBrands(), {
    message:
      // Should be able to use more informative error once SES double
      // disclosure bug is fixed. See
      // https://github.com/endojs/endo/pull/640
      //
      // /"instance" not found: "\[undefined\]"/,
      /.* not found: "\[undefined\]"/,
  });
});

test(`zoe.getTerms - none`, async t => {
  const { zoe } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { instance } = await E(zoe).startInstance(installation);
  t.deepEqual(await E(zoe).getTerms(instance), {
    brands: {},
    issuers: {},
  });
});

test(`zoe.getTerms`, async t => {
  const { zoe, moolaKit } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { instance } = await E(zoe).startInstance(
    installation,
    {
      Moola: moolaKit.issuer,
    },
    {
      someTerm: 2,
    },
  );

  const zoeTerms = await E(zoe).getTerms(instance);

  const expected = {
    issuers: {
      Moola: moolaKit.issuer,
    },
    brands: {
      Moola: moolaKit.brand,
    },
    someTerm: 2,
  };

  t.deepEqual(zoeTerms, expected);
});

test(`zoe.getTerms - no instance`, async t => {
  const { zoe } = setup();
  // @ts-ignore invalid arguments for testing
  await t.throwsAsync(() => E(zoe).getTerms(), {
    message:
      // Should be able to use more informative error once SES double
      // disclosure bug is fixed. See
      // https://github.com/endojs/endo/pull/640
      //
      // /"instance" not found: "\[undefined\]"/,
      /.* not found: "\[undefined\]"/,
  });
});

test(`zoe.getInstallationForInstance`, async t => {
  const { zoe, moolaKit } = setup();
  const contractPath = `${dirname}/../../src/contracts/automaticRefund`;
  const bundle = await bundleSource(contractPath);
  const installation = await E(zoe).install(bundle);
  const { instance } = await E(zoe).startInstance(
    installation,
    {
      Moola: moolaKit.issuer,
    },
    {
      someTerm: 2,
    },
  );

  const installationReturned = await E(zoe).getInstallationForInstance(
    instance,
  );
  t.is(installation, installationReturned);
});

test(`zoe.getInstance`, async t => {
  const { zoe, zcf, instance } = await setupZCFTest();
  const invitation = await E(zcf).makeInvitation(undefined, 'invitation');
  const actualInstance = await E(zoe).getInstance(invitation);
  t.is(actualInstance, instance);
});

test(`zoe.getInstance - no invitation`, async t => {
  const { zoe } = await setupZCFTest();
  // @ts-ignore invalid arguments for testing
  await t.throwsAsync(() => E(zoe).getInstance(), {
    message: /A Zoe invitation is required, not "\[undefined\]"/,
  });
});

test(`zoe.getInstallation`, async t => {
  const { zoe, zcf, installation } = await setupZCFTest();
  const invitation = await E(zcf).makeInvitation(undefined, 'invitation');
  const actualInstallation = await E(zoe).getInstallation(invitation);
  t.is(actualInstallation, installation);
});

test(`zoe.getInstallation - no invitation`, async t => {
  const { zoe } = await setupZCFTest();
  // @ts-ignore invalid arguments for testing
  await t.throwsAsync(() => E(zoe).getInstallation(), {
    message: /A Zoe invitation is required, not "\[undefined\]"/,
  });
});

test(`zoe.getInvitationDetails`, async t => {
  const { zoe, zcf, installation, instance } = await setupZCFTest();
  const invitation = await E(zcf).makeInvitation(undefined, 'invitation');
  const details = await E(zoe).getInvitationDetails(invitation);
  t.deepEqual(details, {
    description: 'invitation',
    handle: details.handle,
    installation,
    instance,
    fee: undefined,
    expiry: undefined,
    zoeTimeAuthority: undefined,
  });
});

test(`zoe.getInvitationDetails - no invitation`, async t => {
  const { zoe } = await setupZCFTest();
  // @ts-ignore invalid arguments for testing
  await t.throwsAsync(() => E(zoe).getInvitationDetails(), {
    message: /A Zoe invitation is required, not "\[undefined\]"/,
  });
});

test(`zoe.makeFeePurse`, async t => {
  const { zoe, zcf, feeMintAccess } = await setupZCFTest();

  const feePurse = E(zoe).makeFeePurse();
  const feeIssuer = E(zoe).getFeeIssuer();
  const feeBrand = await E(feeIssuer).getBrand();

  const zcfMint = await zcf.registerFeeMint('RUN', feeMintAccess);
  const { zcfSeat, userSeat } = zcf.makeEmptySeatKit();

  const fee1000 = AmountMath.make(feeBrand, 1000n);
  zcfMint.mintGains({ Fee: fee1000 }, zcfSeat);

  zcfSeat.exit();
  const payment = await E(userSeat).getPayout('Fee');
  await E(feePurse).deposit(payment);

  t.true(AmountMath.isEqual(await E(feePurse).getCurrentAmount(), fee1000));

  await E(feePurse).withdraw(fee1000);

  t.true(AmountMath.isEmpty(await E(feePurse).getCurrentAmount()));
});

test(`zoe.getConfiguration`, async t => {
  const { zoe } = await setupZCFTest();
  const config = await E(zoe).getConfiguration();
  t.deepEqual(config, {
    feeIssuerConfig: {
      assetKind: 'nat',
      displayInfo: {
        assetKind: 'nat',
        decimalPlaces: 6,
      },
      initialFunds: 0n,
      name: 'RUN',
    },
    meteringConfig: {
      incrementBy: 25000000n,
      initial: 75000000n,
      price: {
        computronDenominator: 1n,
        feeNumerator: 1n,
      },
      threshold: 25000000n,
    },
    zoeFeesConfig: {
      getPublicFacetFee: 0n,
      highFee: 10000000n,
      installFee: 0n,
      longExp: 86400000n,
      lowFee: 500000n,
      offerFee: 0n,
      shortExp: 300000n,
      startInstanceFee: 0n,
      timeAuthority: undefined,
    },
  });
});
