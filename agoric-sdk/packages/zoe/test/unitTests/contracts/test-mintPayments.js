// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import path from 'path';

import bundleSource from '@agoric/bundle-source';
import { E } from '@agoric/eventual-send';
import { makeIssuerKit, AmountMath } from '@agoric/ertp';
import fakeVatAdmin from '../../../tools/fakeVatAdmin.js';

// noinspection ES6PreferShortImport
import { makeZoeKit } from '../../../src/zoeService/zoe.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const mintPaymentsRoot = `${dirname}/../../../src/contracts/mintPayments.js`;

test('zoe - mint payments', async t => {
  t.plan(2);
  const { zoeService } = makeZoeKit(fakeVatAdmin);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);

  const makeAlice = () => {
    return {
      installCode: async () => {
        // pack the contract
        const bundle = await bundleSource(mintPaymentsRoot);
        // install the contract
        const installationP = E(zoe).install(bundle);
        return installationP;
      },
      startInstance: async installation => {
        const adminP = E(zoe).startInstance(installation);
        return adminP;
      },
    };
  };

  const makeBob = installation => {
    return {
      offer: async untrustedInvitation => {
        const invitationIssuer = E(zoe).getInvitationIssuer();
        const invitation = E(invitationIssuer).claim(untrustedInvitation);

        const {
          value: [invitationValue],
        } = await E(invitationIssuer).getAmountOf(invitation);

        t.is(
          invitationValue.installation,
          installation,
          'installation is mintPayment',
        );

        const { instance } = invitationValue;

        const seat = await E(zoe).offer(invitation);

        const paymentP = E(seat).getPayout('Token');

        // Let's get the tokenIssuer from the contract so we can evaluate
        // what we get as our payout
        const publicFacet = await E(zoe).getPublicFacet(instance);
        const tokenIssuer = await E(publicFacet).getTokenIssuer();
        const tokenBrand = await E(tokenIssuer).getBrand();

        const tokens1000 = await AmountMath.make(1000n, tokenBrand);
        const tokenPayoutAmount = await E(tokenIssuer).getAmountOf(paymentP);

        // Bob got 1000 tokens
        t.deepEqual(tokenPayoutAmount, tokens1000);
      },
    };
  };

  // Setup Alice
  const alice = await makeAlice();
  const installation = await alice.installCode();
  const { creatorFacet } = await E(alice).startInstance(installation);
  const invitation = E(creatorFacet).makeInvitation(1000);

  // Setup Bob
  const bob = makeBob(installation);
  await bob.offer(invitation);
});

test('zoe - mint payments with unrelated give and want', async t => {
  t.plan(3);
  const { zoeService } = makeZoeKit(fakeVatAdmin);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);
  const moolaKit = makeIssuerKit('moola');
  const simoleanKit = makeIssuerKit('simolean');

  const makeAlice = () => {
    return {
      installCode: async () => {
        // pack the contract
        const bundle = await bundleSource(mintPaymentsRoot);
        // install the contract
        const installationP = E(zoe).install(bundle);
        return installationP;
      },
      startInstance: async installation => {
        const issuerKeywordRecord = harden({
          Asset: moolaKit.issuer,
          Price: simoleanKit.issuer,
        });
        const adminP = await E(zoe).startInstance(
          installation,
          issuerKeywordRecord,
        );
        return adminP;
      },
    };
  };

  const makeBob = (installation, moolaPayment) => {
    return {
      offer: async untrustedInvitation => {
        const invitationIssuer = E(zoe).getInvitationIssuer();
        const invitation = E(invitationIssuer).claim(untrustedInvitation);

        const {
          value: [invitationValue],
        } = await E(invitationIssuer).getAmountOf(invitation);

        t.is(
          invitationValue.installation,
          installation,
          'installation is mintPayment',
        );

        const { instance } = invitationValue;

        const proposal = harden({
          give: { Asset: AmountMath.make(10n, moolaKit.brand) },
          want: { Price: AmountMath.make(100n, simoleanKit.brand) },
        });
        const paymentKeywordRecord = harden({
          Asset: moolaPayment,
        });
        const seat = await E(zoe).offer(
          invitation,
          proposal,
          paymentKeywordRecord,
        );

        const tokenPaymentP = E(seat).getPayout('Token');
        const moolaRefundP = E(seat).getPayout('Asset');

        // Let's get the tokenIssuer from the contract so we can evaluate
        // what we get as our payout
        const publicFacet = await E(zoe).getPublicFacet(instance);
        const tokenIssuer = await E(publicFacet).getTokenIssuer();
        const tokenBrand = await E(tokenIssuer).getBrand();

        const tokens1000 = await AmountMath.make(1000n, tokenBrand);
        const tokenPayoutAmount = await E(tokenIssuer).getAmountOf(
          tokenPaymentP,
        );

        // Bob got 1000 tokens
        t.deepEqual(tokenPayoutAmount, tokens1000);

        // Got refunded all the moola given
        t.deepEqual(
          await E(moolaKit.issuer).getAmountOf(moolaRefundP),
          AmountMath.make(10n, moolaKit.brand),
        );
      },
    };
  };

  // Setup Alice
  const alice = await makeAlice();
  const installation = await alice.installCode();
  const { creatorFacet } = await E(alice).startInstance(installation);
  const invitation = E(creatorFacet).makeInvitation(1000);

  // Setup Bob
  const bob = makeBob(
    installation,
    moolaKit.mint.mintPayment(AmountMath.make(10n, moolaKit.brand)),
  );
  await bob.offer(invitation);
});
