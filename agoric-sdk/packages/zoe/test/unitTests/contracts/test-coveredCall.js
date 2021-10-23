// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import path from 'path';

import bundleSource from '@agoric/bundle-source';
import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';
import { AmountMath, AssetKind } from '@agoric/ertp';
import { sameStructure } from '@agoric/same-structure';

import buildManualTimer from '../../../tools/manualTimer.js';
import { setup } from '../setupBasicMints.js';
import { setupNonFungible } from '../setupNonFungibleMints.js';
import { assertAmountsEqual } from '../../zoeTestHelpers.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const coveredCallRoot = `${dirname}/../../../src/contracts/coveredCall.js`;
const atomicSwapRoot = `${dirname}/../../../src/contracts/atomicSwap.js`;

test('zoe - coveredCall', async t => {
  t.plan(13);
  const {
    moolaKit,
    simoleanKit,
    bucksKit,
    moola,
    simoleans,
    bucks,
    zoe,
  } = setup();

  const makeAlice = async (timer, moolaPayment) => {
    const moolaPurse = await E(moolaKit.issuer).makeEmptyPurse();
    const simoleanPurse = await E(simoleanKit.issuer).makeEmptyPurse();
    const bucksPurse = await E(bucksKit.issuer).makeEmptyPurse();
    return {
      installCode: async () => {
        // pack the contract
        const bundle = await bundleSource(coveredCallRoot);
        // install the contract
        const installationP = E(zoe).install(bundle);
        return installationP;
      },
      startInstance: async installation => {
        const issuerKeywordRecord = harden({
          Moola: moolaKit.issuer,
          Simoleans: simoleanKit.issuer,
          Bucks: bucksKit.issuer,
        });
        const adminP = E(zoe).startInstance(installation, issuerKeywordRecord);
        return adminP;
      },
      offer: async createCallOptionInvitation => {
        const proposal = harden({
          give: { Moola: moola(3) },
          want: { Simoleans: simoleans(7), Bucks: bucks(2) },
          exit: { afterDeadline: { deadline: 1n, timer } },
        });
        const payments = { Moola: moolaPayment };

        const seat = await E(zoe).offer(
          createCallOptionInvitation,
          proposal,
          payments,
        );

        // The result of making the first offer is the call option
        // digital asset. It is simultaneously actually an invitation to
        // exercise the option.
        const invitationP = E(seat).getOfferResult();
        return { seat, invitationP };
      },
      processPayouts: async seat => {
        await E(seat)
          .getPayout('Moola')
          .then(moolaPurse.deposit)
          .then(amountDeposited =>
            t.deepEqual(
              amountDeposited,
              moola(0n),
              `Alice didn't get any of what she put in`,
            ),
          );

        await E(seat)
          .getPayout('Simoleans')
          .then(simoleanPurse.deposit)
          .then(amountDeposited =>
            t.deepEqual(
              amountDeposited,
              simoleans(7),
              `Alice got exactly what she wanted`,
            ),
          );

        await E(seat)
          .getPayout('Bucks')
          .then(bucksPurse.deposit)
          .then(amountDeposited =>
            t.deepEqual(
              amountDeposited,
              bucks(2),
              `Alice got exactly what she wanted`,
            ),
          );
      },
    };
  };

  const makeBob = (timer, installation, simoleanPayment, bucksPayment) => {
    const moolaPurse = moolaKit.issuer.makeEmptyPurse();
    const simoleanPurse = simoleanKit.issuer.makeEmptyPurse();
    const bucksPurse = bucksKit.issuer.makeEmptyPurse();
    return Far('bob', {
      offer: async untrustedInvitation => {
        const invitationIssuer = await E(zoe).getInvitationIssuer();

        // Bob is able to use the trusted invitationIssuer from Zoe to
        // transform an untrusted invitation that Alice also has access to
        const invitation = await E(invitationIssuer).claim(untrustedInvitation);

        const invitationValue = await E(zoe).getInvitationDetails(invitation);

        t.is(
          invitationValue.installation,
          installation,
          'installation is coveredCall',
        );
        t.is(invitationValue.description, 'exerciseOption');

        t.deepEqual(
          invitationValue.underlyingAssets,
          { Moola: moola(3) },
          `underlying assets are 3 moola`,
        );
        t.deepEqual(
          invitationValue.strikePrice,
          { Simoleans: simoleans(7), Bucks: bucks(2) },
          `strike price is 7 simoleans and 2 bucks, so bob must give that`,
        );

        t.is(invitationValue.expirationDate, 1n);
        t.deepEqual(invitationValue.timeAuthority, timer);

        const proposal = harden({
          give: { StrikePrice1: simoleans(7), StrikePrice2: bucks(2) },
          want: { UnderlyingAsset: moola(3) },
          exit: { onDemand: null },
        });
        const payments = {
          StrikePrice1: simoleanPayment,
          StrikePrice2: bucksPayment,
        };

        const seat = await E(zoe).offer(invitation, proposal, payments);

        t.is(
          await E(seat).getOfferResult(),
          `The option was exercised. Please collect the assets in your payout.`,
        );
        return seat;
      },
      processPayouts: async seat => {
        await E(seat)
          .getPayout('UnderlyingAsset')
          .then(moolaPurse.deposit)
          .then(amountDeposited =>
            t.deepEqual(amountDeposited, moola(3), `Bob got what he wanted`),
          );

        await E(seat)
          .getPayout('StrikePrice1')
          .then(simoleanPurse.deposit)
          .then(amountDeposited =>
            t.deepEqual(
              amountDeposited,
              simoleans(0),
              `Bob didn't get anything back`,
            ),
          );

        await E(seat)
          .getPayout('StrikePrice2')
          .then(bucksPurse.deposit)
          .then(amountDeposited =>
            t.deepEqual(
              amountDeposited,
              bucks(0),
              `Bob didn't get anything back`,
            ),
          );
      },
    });
  };

  const timer = buildManualTimer(console.log);

  // Setup Alice
  const aliceMoolaPayment = moolaKit.mint.mintPayment(moola(3));
  const alice = await makeAlice(timer, aliceMoolaPayment);

  // Alice makes an instance and makes her offer.
  const installation = await alice.installCode();

  // Setup Bob
  const bobSimoleanPayment = simoleanKit.mint.mintPayment(simoleans(7));
  const bobBucksPayment = bucksKit.mint.mintPayment(bucks(2));
  const bob = makeBob(timer, installation, bobSimoleanPayment, bobBucksPayment);

  const { creatorInvitation } = await alice.startInstance(installation);
  const { seat: aliceSeat, invitationP } = await alice.offer(creatorInvitation);

  // Alice spreads the invitation far and wide with instructions
  // on how to use it and Bob decides he wants to be the
  // counter-party, without needing to trust Alice at all.
  const bobSeat = await bob.offer(invitationP);

  await alice.processPayouts(aliceSeat);
  await bob.processPayouts(bobSeat);
});

test(`zoe - coveredCall - alice's deadline expires, cancelling alice and bob`, async t => {
  t.plan(13);
  const { moolaR, simoleanR, moola, simoleans, zoe } = setup();
  // Pack the contract.
  const bundle = await bundleSource(coveredCallRoot);
  const coveredCallInstallation = await E(zoe).install(bundle);
  const timer = buildManualTimer(console.log);

  // Setup Alice
  const aliceMoolaPayment = moolaR.mint.mintPayment(moola(3));
  const aliceMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const aliceSimoleanPurse = simoleanR.issuer.makeEmptyPurse();

  // Setup Bob
  const bobSimoleanPayment = simoleanR.mint.mintPayment(simoleans(7));
  const bobMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const bobSimoleanPurse = simoleanR.issuer.makeEmptyPurse();

  // Alice creates a coveredCall instance
  const issuerKeywordRecord = harden({
    UnderlyingAsset: moolaR.issuer,
    StrikePrice: simoleanR.issuer,
  });
  const { creatorInvitation: aliceInvitation } = await E(zoe).startInstance(
    coveredCallInstallation,
    issuerKeywordRecord,
  );

  // Alice escrows with Zoe
  const aliceProposal = harden({
    give: { UnderlyingAsset: moola(3) },
    want: { StrikePrice: simoleans(7) },
    exit: {
      afterDeadline: {
        deadline: 1n,
        timer,
      },
    },
  });
  const alicePayments = { UnderlyingAsset: aliceMoolaPayment };
  // Alice makes an option
  const aliceSeat = await E(zoe).offer(
    aliceInvitation,
    aliceProposal,
    alicePayments,
  );
  timer.tick();

  const optionP = E(aliceSeat).getOfferResult();

  // Imagine that Alice sends the option to Bob for free (not done here
  // since this test doesn't actually have separate vats/parties)

  // Bob inspects the option (an invitation payment) and checks that it is the
  // contract instance that he expects as well as that Alice has
  // already escrowed.

  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const bobExclOption = await E(invitationIssuer).claim(optionP);
  const optionValue = await E(zoe).getInvitationDetails(bobExclOption);
  t.is(optionValue.installation, coveredCallInstallation);
  t.is(optionValue.description, 'exerciseOption');
  t.deepEqual(optionValue.underlyingAssets, { UnderlyingAsset: moola(3) });
  t.deepEqual(optionValue.strikePrice, { StrikePrice: simoleans(7) });
  t.is(optionValue.expirationDate, 1n);
  t.deepEqual(optionValue.timeAuthority, timer);

  const bobPayments = { StrikePrice: bobSimoleanPayment };

  const bobProposal = harden({
    want: optionValue.underlyingAssets,
    give: optionValue.strikePrice,
  });

  // Bob escrows
  const bobSeat = await E(zoe).offer(bobExclOption, bobProposal, bobPayments);

  // TODO is this await safe?
  await t.throwsAsync(
    () => E(bobSeat).getOfferResult(),
    { message: /The covered call option is expired./ },
    'The call option should be expired',
  );

  const bobMoolaPayout = await E(bobSeat).getPayout('UnderlyingAsset');
  const bobSimoleanPayout = await E(bobSeat).getPayout('StrikePrice');
  const aliceMoolaPayout = await E(aliceSeat).getPayout('UnderlyingAsset');
  const aliceSimoleanPayout = await E(aliceSeat).getPayout('StrikePrice');

  // Alice gets back what she put in
  t.deepEqual(await moolaR.issuer.getAmountOf(aliceMoolaPayout), moola(3));

  // Alice doesn't get what she wanted
  t.deepEqual(
    await simoleanR.issuer.getAmountOf(aliceSimoleanPayout),
    simoleans(0),
  );

  // Alice deposits her winnings to ensure she can
  await aliceMoolaPurse.deposit(aliceMoolaPayout);
  await aliceSimoleanPurse.deposit(aliceSimoleanPayout);

  // Bob deposits his winnings to ensure he can
  await bobMoolaPurse.deposit(bobMoolaPayout);
  await bobSimoleanPurse.deposit(bobSimoleanPayout);

  // Assert that the correct outcome was achieved.
  // Alice had 3 moola and 0 simoleans.
  // Bob had 0 moola and 7 simoleans.
  t.deepEqual(aliceMoolaPurse.getCurrentAmount(), moola(3));
  t.deepEqual(aliceSimoleanPurse.getCurrentAmount(), simoleans(0));
  t.deepEqual(bobMoolaPurse.getCurrentAmount(), moola(0n));
  t.deepEqual(bobSimoleanPurse.getCurrentAmount(), simoleans(7));
});

// Alice makes a covered call and escrows. She shares the invitation to
// Bob. Bob tries to sell the invitation to Dave through a swap. Can Bob
// trick Dave? Can Dave describe what it is that he wants in the swap
// offer description?
test('zoe - coveredCall with swap for invitation', async t => {
  t.plan(24);
  // Setup the environment
  const timer = buildManualTimer(console.log);
  const { moolaR, simoleanR, bucksR, moola, simoleans, bucks, zoe } = setup();
  // Pack the contract.
  const coveredCallBundle = await bundleSource(coveredCallRoot);

  const coveredCallInstallation = await E(zoe).install(coveredCallBundle);
  const atomicSwapBundle = await bundleSource(atomicSwapRoot);

  const swapInstallationId = await E(zoe).install(atomicSwapBundle);

  // Setup Alice
  // Alice starts with 3 moola
  const aliceMoolaPayment = moolaR.mint.mintPayment(moola(3));
  const aliceMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const aliceSimoleanPurse = simoleanR.issuer.makeEmptyPurse();

  // Setup Bob
  // Bob starts with nothing
  const bobMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const bobSimoleanPurse = simoleanR.issuer.makeEmptyPurse();
  const bobBucksPurse = bucksR.issuer.makeEmptyPurse();

  // Setup Dave
  // Dave starts with 1 buck
  const daveSimoleanPayment = simoleanR.mint.mintPayment(simoleans(7));
  const daveBucksPayment = bucksR.mint.mintPayment(bucks(1));
  const daveMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const daveSimoleanPurse = simoleanR.issuer.makeEmptyPurse();
  const daveBucksPurse = bucksR.issuer.makeEmptyPurse();

  // Alice creates a coveredCall instance of moola for simoleans
  const issuerKeywordRecord = harden({
    UnderlyingAsset: moolaR.issuer,
    StrikePrice: simoleanR.issuer,
  });
  const { creatorInvitation: aliceInvitation } = await E(zoe).startInstance(
    coveredCallInstallation,
    issuerKeywordRecord,
  );

  // Alice escrows with Zoe. She specifies her proposal,
  // which includes the amounts she gives and wants as well as the exit
  // conditions. In this case, she choses an exit condition of after
  // the deadline of "100" according to a particular timer. This is
  // meant to be something far in the future, and will not be
  // reached in this test.

  const aliceProposal = harden({
    give: { UnderlyingAsset: moola(3) },
    want: { StrikePrice: simoleans(7) },
    exit: {
      afterDeadline: {
        deadline: 100n, // we will not reach this
        timer,
      },
    },
  });
  const alicePayments = { UnderlyingAsset: aliceMoolaPayment };
  // Alice makes an option.
  const aliceSeat = await E(zoe).offer(
    aliceInvitation,
    aliceProposal,
    alicePayments,
  );

  const optionP = E(aliceSeat).getOfferResult();

  // Imagine that Alice sends the invitation to Bob (not done here since
  // this test doesn't actually have separate vats/parties)

  // Bob inspects the invitation payment and checks its information against the
  // questions that he has about whether it is worth being a counter
  // party in the covered call: Did the covered call use the
  // expected covered call installation (code)? Does it use the issuers
  // that he expects (moola and simoleans)?
  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const invitationBrand = await E(invitationIssuer).getBrand();
  const bobExclOption = await E(invitationIssuer).claim(optionP);
  const optionAmount = await E(invitationIssuer).getAmountOf(bobExclOption);
  const optionDesc = optionAmount.value[0];
  t.is(optionDesc.installation, coveredCallInstallation);
  t.is(optionDesc.description, 'exerciseOption');
  t.deepEqual(optionDesc.underlyingAssets, { UnderlyingAsset: moola(3) });
  t.deepEqual(optionDesc.strikePrice, { StrikePrice: simoleans(7) });
  t.is(optionDesc.expirationDate, 100n);
  t.deepEqual(optionDesc.timeAuthority, timer);

  // Let's imagine that Bob wants to create a swap to trade this
  // invitation for bucks.
  const swapIssuerKeywordRecord = harden({
    Asset: invitationIssuer,
    Price: bucksR.issuer,
  });
  const { creatorInvitation: bobSwapInvitation } = await E(zoe).startInstance(
    swapInstallationId,
    swapIssuerKeywordRecord,
  );

  // Bob wants to swap an invitation with the same amount as his
  // current invitation from Alice. He wants 1 buck in return.
  const bobProposalSwap = harden({
    give: { Asset: await E(invitationIssuer).getAmountOf(bobExclOption) },
    want: { Price: bucks(1) },
  });

  const bobPayments = harden({ Asset: bobExclOption });

  // Bob escrows his option in the swap
  // Bob makes an offer to the swap with his "higher order" invitation
  const bobSwapSeat = await E(zoe).offer(
    bobSwapInvitation,
    bobProposalSwap,
    bobPayments,
  );

  const daveSwapInvitationP = E(bobSwapSeat).getOfferResult();

  // Bob passes the swap invitation to Dave and tells him the
  // optionAmounts (basically, the description of the option)

  const {
    value: [{ instance: swapInstance, installation: daveSwapInstallId }],
  } = await E(invitationIssuer).getAmountOf(daveSwapInvitationP);

  const daveSwapIssuers = await E(zoe).getIssuers(swapInstance);

  // Dave is looking to buy the option to trade his 7 simoleans for
  // 3 moola, and is willing to pay 1 buck for the option. He
  // checks that this instance matches what he wants

  // Did this swap use the correct swap installation? Yes
  t.is(daveSwapInstallId, swapInstallationId);

  // Is this swap for the correct issuers and has no other terms? Yes
  t.truthy(
    sameStructure(
      daveSwapIssuers,
      harden({
        Asset: invitationIssuer,
        Price: bucksR.issuer,
      }),
    ),
  );

  // What's actually up to be bought? Is it the kind of invitation that
  // Dave wants? What's the price for that invitation? Is it acceptable
  // to Dave? Bob can tell Dave this out of band, and if he lies,
  // Dave's offer will be rejected and he will get a refund. Dave
  // knows this to be true because he knows the swap.

  // Dave escrows his 1 buck with Zoe and forms his proposal
  const daveSwapProposal = harden({
    want: { Asset: optionAmount },
    give: { Price: bucks(1) },
  });

  const daveSwapPayments = harden({ Price: daveBucksPayment });
  const daveSwapSeat = await E(zoe).offer(
    daveSwapInvitationP,
    daveSwapProposal,
    daveSwapPayments,
  );

  t.is(
    await daveSwapSeat.getOfferResult(),
    'The offer has been accepted. Once the contract has been completed, please check your payout',
  );

  const daveOption = await daveSwapSeat.getPayout('Asset');
  const daveBucksPayout = await daveSwapSeat.getPayout('Price');

  // Dave exercises his option by making an offer to the covered
  // call. First, he escrows with Zoe.

  const daveCoveredCallProposal = harden({
    want: { UnderlyingAsset: moola(3) },
    give: { StrikePrice: simoleans(7) },
  });
  const daveCoveredCallPayments = harden({
    StrikePrice: daveSimoleanPayment,
  });
  const daveCoveredCallSeat = await E(zoe).offer(
    daveOption,
    daveCoveredCallProposal,
    daveCoveredCallPayments,
  );

  t.is(
    await E(daveCoveredCallSeat).getOfferResult(),
    `The option was exercised. Please collect the assets in your payout.`,
  );

  // Dave should get 3 moola, Bob should get 1 buck, and Alice
  // get 7 simoleans
  const daveMoolaPayout = await daveCoveredCallSeat.getPayout(
    'UnderlyingAsset',
  );
  const daveSimoleanPayout = await daveCoveredCallSeat.getPayout('StrikePrice');
  const aliceMoolaPayout = await aliceSeat.getPayout('UnderlyingAsset');
  const aliceSimoleanPayout = await aliceSeat.getPayout('StrikePrice');
  const bobInvitationPayout = await bobSwapSeat.getPayout('Asset');
  const bobBucksPayout = await bobSwapSeat.getPayout('Price');

  t.deepEqual(await moolaR.issuer.getAmountOf(daveMoolaPayout), moola(3));
  t.deepEqual(
    await simoleanR.issuer.getAmountOf(daveSimoleanPayout),
    simoleans(0),
  );

  t.deepEqual(await moolaR.issuer.getAmountOf(aliceMoolaPayout), moola(0n));
  t.deepEqual(
    await simoleanR.issuer.getAmountOf(aliceSimoleanPayout),
    simoleans(7),
  );

  t.deepEqual(
    await E(invitationIssuer).getAmountOf(bobInvitationPayout),
    AmountMath.makeEmpty(invitationBrand, AssetKind.SET),
  );
  t.deepEqual(await bucksR.issuer.getAmountOf(bobBucksPayout), bucks(1));

  // Alice deposits her payouts
  await aliceMoolaPurse.deposit(aliceMoolaPayout);
  await aliceSimoleanPurse.deposit(aliceSimoleanPayout);

  // Bob deposits his payouts
  await bobBucksPurse.deposit(bobBucksPayout);

  // Dave deposits his payouts
  await daveMoolaPurse.deposit(daveMoolaPayout);
  await daveSimoleanPurse.deposit(daveSimoleanPayout);
  await daveBucksPurse.deposit(daveBucksPayout);

  t.is(aliceMoolaPurse.getCurrentAmount().value, 0n);
  t.is(aliceSimoleanPurse.getCurrentAmount().value, 7n);

  t.is(bobMoolaPurse.getCurrentAmount().value, 0n);
  t.is(bobSimoleanPurse.getCurrentAmount().value, 0n);
  t.is(bobBucksPurse.getCurrentAmount().value, 1n);

  t.is(daveMoolaPurse.getCurrentAmount().value, 3n);
  t.is(daveSimoleanPurse.getCurrentAmount().value, 0n);
  t.is(daveBucksPurse.getCurrentAmount().value, 0n);
});

// Alice makes a covered call and escrows. She shares the invitation to
// Bob. Bob tries to sell the invitation to Dave through another covered
// call. Can Bob trick Dave? Can Dave describe what it is that he
// wants in his offer description in the second covered call?
test('zoe - coveredCall with coveredCall for invitation', async t => {
  t.plan(31);
  // Setup the environment
  const timer = buildManualTimer(console.log);
  const { moolaR, simoleanR, bucksR, moola, simoleans, bucks, zoe } = setup();

  // Pack the contract.
  const bundle = await bundleSource(coveredCallRoot);

  const coveredCallInstallation = await E(zoe).install(bundle);

  // Setup Alice
  // Alice starts with 3 moola
  const aliceMoolaPayment = moolaR.mint.mintPayment(moola(3));
  const aliceMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const aliceSimoleanPurse = simoleanR.issuer.makeEmptyPurse();

  // Setup Bob
  // Bob starts with nothing
  const bobMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const bobSimoleanPurse = simoleanR.issuer.makeEmptyPurse();
  const bobBucksPurse = bucksR.issuer.makeEmptyPurse();

  // Setup Dave
  // Dave starts with 1 buck and 7 simoleans
  const daveSimoleanPayment = simoleanR.mint.mintPayment(simoleans(7));
  const daveBucksPayment = bucksR.mint.mintPayment(bucks(1));
  const daveMoolaPurse = moolaR.issuer.makeEmptyPurse();
  const daveSimoleanPurse = simoleanR.issuer.makeEmptyPurse();
  const daveBucksPurse = bucksR.issuer.makeEmptyPurse();

  // Alice creates a coveredCall instance of moola for simoleans
  const issuerKeywordRecord = harden({
    UnderlyingAsset: moolaR.issuer,
    StrikePrice: simoleanR.issuer,
  });
  const { creatorInvitation: aliceCoveredCallInvitation } = await E(
    zoe,
  ).startInstance(coveredCallInstallation, issuerKeywordRecord);

  // Alice escrows with Zoe. She specifies her proposal,
  // which include what she wants and gives as well as the exit
  // condition. In this case, she choses an exit condition of after
  // the deadline of "100" according to a particular timer. This is
  // meant to be something far in the future, and will not be
  // reached in this test.

  const aliceProposal = harden({
    give: { UnderlyingAsset: moola(3) },
    want: { StrikePrice: simoleans(7) },
    exit: {
      afterDeadline: {
        deadline: 100n, // we will not reach this
        timer,
      },
    },
  });
  const alicePayments = { UnderlyingAsset: aliceMoolaPayment };
  // Alice makes a call option, which is an invitation to join the
  // covered call contract
  const aliceSeat = await E(zoe).offer(
    aliceCoveredCallInvitation,
    aliceProposal,
    alicePayments,
  );
  const optionP = await E(aliceSeat).getOfferResult();

  // Imagine that Alice sends the invitation to Bob as well as the
  // instanceHandle (not done here since this test doesn't actually have
  // separate vats/parties)

  // Bob inspects the invitation payment and checks its information against the
  // questions that he has about whether it is worth being a counter
  // party in the covered call: Did the covered call use the
  // expected covered call installation (code)? Does it use the issuers
  // that he expects (moola and simoleans)?
  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const bobExclOption = await E(invitationIssuer).claim(optionP);
  const optionValue = await E(zoe).getInvitationDetails(bobExclOption);
  t.is(optionValue.installation, coveredCallInstallation);
  t.is(optionValue.description, 'exerciseOption');
  t.deepEqual(optionValue.underlyingAssets, { UnderlyingAsset: moola(3) });
  t.deepEqual(optionValue.strikePrice, { StrikePrice: simoleans(7) });
  t.is(optionValue.expirationDate, 100n);
  t.deepEqual(optionValue.timeAuthority, timer);

  // Let's imagine that Bob wants to create another coveredCall, but
  // this time to trade this invitation for bucks.
  const issuerKeywordRecord2 = harden({
    UnderlyingAsset: invitationIssuer,
    StrikePrice: bucksR.issuer,
  });
  const { creatorInvitation: bobInvitationForSecondCoveredCall } = await E(
    zoe,
  ).startInstance(coveredCallInstallation, issuerKeywordRecord2);

  // Bob wants to swap an invitation with the same amount as his
  // current invitation from Alice. He wants 1 buck in return.
  const bobProposalSecondCoveredCall = harden({
    give: {
      UnderlyingAsset: await E(invitationIssuer).getAmountOf(bobExclOption),
    },
    want: { StrikePrice: bucks(1) },
    exit: {
      afterDeadline: {
        deadline: 100n, // we will not reach this
        timer,
      },
    },
  });

  const bobPayments = { UnderlyingAsset: bobExclOption };

  // Bob escrows his invitation
  // Bob makes an offer to the swap with his "higher order" option
  const bobSeat = await E(zoe).offer(
    bobInvitationForSecondCoveredCall,
    bobProposalSecondCoveredCall,
    bobPayments,
  );
  const invitationForDaveP = E(bobSeat).getOfferResult();

  // Bob passes the higher order invitation and
  // optionAmounts to Dave

  // Dave is looking to buy the option to trade his 7 simoleans for
  // 3 moola, and is willing to pay 1 buck for the option. He
  // checks that this invitation matches what he wants
  const daveExclOption = await E(invitationIssuer).claim(invitationForDaveP);
  const daveOptionValue = await E(zoe).getInvitationDetails(daveExclOption);
  t.is(daveOptionValue.installation, coveredCallInstallation);
  t.is(daveOptionValue.description, 'exerciseOption');
  assertAmountsEqual(t, daveOptionValue.strikePrice.StrikePrice, bucks(1));
  t.is(daveOptionValue.expirationDate, 100n);
  t.deepEqual(daveOptionValue.timeAuthority, timer);

  // What about the underlying asset (the other option)?
  t.is(
    daveOptionValue.underlyingAssets.UnderlyingAsset.value[0].description,
    'exerciseOption',
  );
  t.is(
    daveOptionValue.underlyingAssets.UnderlyingAsset.value[0].expirationDate,
    100n,
  );
  assertAmountsEqual(
    t,
    daveOptionValue.underlyingAssets.UnderlyingAsset.value[0].strikePrice
      .StrikePrice,
    simoleans(7),
  );
  t.deepEqual(
    daveOptionValue.underlyingAssets.UnderlyingAsset.value[0].timeAuthority,
    timer,
  );

  // Dave's planned proposal
  const daveProposalCoveredCall = harden({
    want: daveOptionValue.underlyingAssets,
    give: { StrikePrice: bucks(1) },
  });

  // Dave escrows his 1 buck with Zoe and forms his proposal

  const daveSecondCoveredCallPayments = { StrikePrice: daveBucksPayment };
  const daveSecondCoveredCallSeat = await E(zoe).offer(
    daveExclOption,
    daveProposalCoveredCall,
    daveSecondCoveredCallPayments,
  );
  t.is(
    await E(daveSecondCoveredCallSeat).getOfferResult(),
    `The option was exercised. Please collect the assets in your payout.`,
    `dave second offer accepted`,
  );

  const firstCoveredCallInvitation = await daveSecondCoveredCallSeat.getPayout(
    'UnderlyingAsset',
  );
  const daveBucksPayout = await daveSecondCoveredCallSeat.getPayout(
    'StrikePrice',
  );

  // Dave exercises his option by making an offer to the covered
  // call. First, he escrows with Zoe.

  const daveFirstCoveredCallProposal = harden({
    want: { UnderlyingAsset: moola(3) },
    give: { StrikePrice: simoleans(7) },
  });
  const daveFirstCoveredCallPayments = harden({
    StrikePrice: daveSimoleanPayment,
  });
  const daveFirstCoveredCallSeat = await E(zoe).offer(
    firstCoveredCallInvitation,
    daveFirstCoveredCallProposal,
    daveFirstCoveredCallPayments,
  );

  t.is(
    await daveFirstCoveredCallSeat.getOfferResult(),
    'The option was exercised. Please collect the assets in your payout.',
    `dave first offer accepted`,
  );

  // Dave should get 3 moola, Bob should get 1 buck, and Alice
  // get 7 simoleans

  const daveMoolaPayout = await daveFirstCoveredCallSeat.getPayout(
    'UnderlyingAsset',
  );
  const daveSimoleanPayout = await daveFirstCoveredCallSeat.getPayout(
    'StrikePrice',
  );

  const aliceMoolaPayout = await aliceSeat.getPayout('UnderlyingAsset');
  const aliceSimoleanPayout = await aliceSeat.getPayout('StrikePrice');

  const bobInvitationPayout = await bobSeat.getPayout('UnderlyingAsset');
  const bobBucksPayout = await bobSeat.getPayout('StrikePrice');

  t.deepEqual(await moolaR.issuer.getAmountOf(daveMoolaPayout), moola(3));
  t.deepEqual(
    await simoleanR.issuer.getAmountOf(daveSimoleanPayout),
    simoleans(0),
  );

  t.deepEqual(await moolaR.issuer.getAmountOf(aliceMoolaPayout), moola(0n));
  t.deepEqual(
    await simoleanR.issuer.getAmountOf(aliceSimoleanPayout),
    simoleans(7),
  );

  const invitationBrand = await E(invitationIssuer).getBrand();
  t.deepEqual(
    await E(invitationIssuer).getAmountOf(bobInvitationPayout),
    AmountMath.makeEmpty(invitationBrand, AssetKind.SET),
  );
  t.deepEqual(await bucksR.issuer.getAmountOf(bobBucksPayout), bucks(1));

  // Alice deposits her payouts
  await aliceMoolaPurse.deposit(aliceMoolaPayout);
  await aliceSimoleanPurse.deposit(aliceSimoleanPayout);

  // Bob deposits his payouts
  await bobBucksPurse.deposit(bobBucksPayout);

  // Dave deposits his payouts
  await daveMoolaPurse.deposit(daveMoolaPayout);
  await daveSimoleanPurse.deposit(daveSimoleanPayout);
  await daveBucksPurse.deposit(daveBucksPayout);

  t.is(aliceMoolaPurse.getCurrentAmount().value, 0n);
  t.is(aliceSimoleanPurse.getCurrentAmount().value, 7n);

  t.is(bobMoolaPurse.getCurrentAmount().value, 0n);
  t.is(bobSimoleanPurse.getCurrentAmount().value, 0n);
  t.is(bobBucksPurse.getCurrentAmount().value, 1n);

  t.is(daveMoolaPurse.getCurrentAmount().value, 3n);
  t.is(daveSimoleanPurse.getCurrentAmount().value, 0n);
  t.is(daveBucksPurse.getCurrentAmount().value, 0n);
});

// Alice uses a covered call to sell a cryptoCat to Bob for the
// 'Glorious shield' she has wanted for a long time.
test('zoe - coveredCall non-fungible', async t => {
  t.plan(13);
  const {
    ccIssuer,
    rpgIssuer,
    ccMint,
    rpgMint,
    cryptoCats,
    rpgItems,
    createRpgItem,
    zoe,
  } = setupNonFungible();

  // install the contract.
  const bundle = await bundleSource(coveredCallRoot);
  const coveredCallInstallation = await E(zoe).install(bundle);
  const timer = buildManualTimer(console.log);

  // Setup Alice
  const growlTiger = harden(['GrowlTiger']);
  const growlTigerAmount = cryptoCats(growlTiger);
  const aliceCcPayment = ccMint.mintPayment(growlTigerAmount);
  const aliceCcPurse = ccIssuer.makeEmptyPurse();
  const aliceRpgPurse = rpgIssuer.makeEmptyPurse();

  // Setup Bob
  const aGloriousShield = createRpgItem(
    'Glorious Shield',
    25,
    'a Glorious Shield, burnished to a blinding brightness',
  );
  const aGloriousShieldAmount = rpgItems(aGloriousShield);
  const bobRpgPayment = rpgMint.mintPayment(aGloriousShieldAmount);
  const bobCcPurse = ccIssuer.makeEmptyPurse();
  const bobRpgPurse = rpgIssuer.makeEmptyPurse();

  // Alice creates a coveredCall instance
  const issuerKeywordRecord = harden({
    UnderlyingAsset: ccIssuer,
    StrikePrice: rpgIssuer,
  });
  // separate issuerKeywordRecord from contract-specific terms
  const { creatorInvitation: aliceInvitation } = await E(zoe).startInstance(
    coveredCallInstallation,
    issuerKeywordRecord,
  );

  // Alice escrows with Zoe
  const aliceProposal = harden({
    give: { UnderlyingAsset: growlTigerAmount },
    want: { StrikePrice: aGloriousShieldAmount },
    exit: { afterDeadline: { deadline: 1n, timer } },
  });
  const alicePayments = { UnderlyingAsset: aliceCcPayment };
  // Alice creates a call option
  const aliceSeat = await E(zoe).offer(
    aliceInvitation,
    aliceProposal,
    alicePayments,
  );
  const optionP = E(aliceSeat).getOfferResult();

  // Imagine that Alice sends the option to Bob for free (not done here
  // since this test doesn't actually have separate vats/parties)

  // Bob inspects the option (an invitation payment) and checks that it is the
  // contract instance that he expects as well as that Alice has
  // already escrowed.

  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const bobExclOption = await E(invitationIssuer).claim(optionP);
  const optionValue = await E(zoe).getInvitationDetails(bobExclOption);
  t.is(optionValue.installation, coveredCallInstallation);
  t.is(optionValue.description, 'exerciseOption');
  assertAmountsEqual(
    t,
    optionValue.underlyingAssets.UnderlyingAsset,
    growlTigerAmount,
  );
  assertAmountsEqual(
    t,
    optionValue.strikePrice.StrikePrice,
    aGloriousShieldAmount,
  );
  t.is(optionValue.expirationDate, 1n);
  t.deepEqual(optionValue.timeAuthority, timer);

  const bobPayments = { StrikePrice: bobRpgPayment };

  const bobProposal = harden({
    want: optionValue.underlyingAssets,
    give: optionValue.strikePrice,
    exit: { onDemand: null },
  });

  // Bob redeems his invitation and escrows with Zoe
  // Bob exercises the option
  const bobSeat = await E(zoe).offer(bobExclOption, bobProposal, bobPayments);

  t.is(
    await E(bobSeat).getOfferResult(),
    `The option was exercised. Please collect the assets in your payout.`,
  );

  const bobCcPayout = await E(bobSeat).getPayout('UnderlyingAsset');
  const bobRpgPayout = await E(bobSeat).getPayout('StrikePrice');
  const aliceCcPayout = await E(aliceSeat).getPayout('UnderlyingAsset');
  const aliceRpgPayout = await E(aliceSeat).getPayout('StrikePrice');

  // Alice gets what Alice wanted
  t.deepEqual(
    await rpgIssuer.getAmountOf(aliceRpgPayout),
    aliceProposal.want.StrikePrice,
  );

  // Alice didn't get any of what Alice put in
  t.deepEqual(
    await ccIssuer.getAmountOf(aliceCcPayout),
    cryptoCats(harden([])),
  );

  // Alice deposits her payout to ensure she can
  await aliceCcPurse.deposit(aliceCcPayout);
  await aliceRpgPurse.deposit(aliceRpgPayout);

  // Bob deposits his original payments to ensure he can
  await bobCcPurse.deposit(bobCcPayout);
  await bobRpgPurse.deposit(bobRpgPayout);

  // Assert that the correct payouts were received.
  // Alice had growlTiger and no RPG tokens.
  // Bob had an empty CryptoCat purse and the Glorious Shield.
  t.deepEqual(aliceCcPurse.getCurrentAmount().value, []);
  t.deepEqual(aliceRpgPurse.getCurrentAmount().value, aGloriousShield);
  t.deepEqual(bobCcPurse.getCurrentAmount().value, ['GrowlTiger']);
  t.deepEqual(bobRpgPurse.getCurrentAmount().value, []);
});
