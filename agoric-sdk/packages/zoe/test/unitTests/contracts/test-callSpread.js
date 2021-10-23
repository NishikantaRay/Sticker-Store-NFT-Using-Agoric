// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import path from 'path';

import { E } from '@agoric/eventual-send';
import '../../../exported.js';
import buildManualTimer from '../../../tools/manualTimer.js';

import { setup } from '../setupBasicMints.js';
import { installationPFromSource } from '../installFromSource.js';
import {
  assertPayoutDeposit,
  assertPayoutAmount,
} from '../../zoeTestHelpers.js';
import { makeFakePriceAuthority } from '../../../tools/fakePriceAuthority.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const fundedCallSpread = `${dirname}/../../../src/contracts/callSpread/fundedCallSpread.js`;
const pricedCallSpread = `${dirname}/../../../src/contracts/callSpread/pricedCallSpread.js`;
const simpleExchange = `${dirname}/../../../src/contracts/simpleExchange.js`;

const makeTestPriceAuthority = (brands, priceList, timer) =>
  makeFakePriceAuthority({
    actualBrandIn: brands.get('simoleans'),
    actualBrandOut: brands.get('moola'),
    priceList,
    timer,
  });

// Underlying is in Simoleans. Collateral, strikePrice and Payout are in bucks.
// Value is in Moola. The price oracle takes an amount in Underlying, and
// gives the value in Moola.
test('fundedCallSpread below Strike1', async t => {
  const {
    moolaIssuer,
    simoleanIssuer,
    moola,
    simoleans,
    bucksIssuer,
    bucksMint,
    bucks,
    zoe,
    brands,
  } = setup();
  const installation = await installationPFromSource(zoe, fundedCallSpread);

  // Alice will create and fund a call spread contract, and give the invitations
  // to Bob and Carol. Bob and Carol will promptly schedule collection of funds.
  // The spread will then mature at a low price, and carol will get paid.

  // Setup Alice
  const aliceBucksPayment = bucksMint.mintPayment(bucks(300));
  // Setup Bob
  const bobBucksPurse = bucksIssuer.makeEmptyPurse();
  // Setup Carol
  const carolBucksPurse = bucksIssuer.makeEmptyPurse();

  const manualTimer = buildManualTimer(console.log, 0n);
  const priceAuthority = makeTestPriceAuthority(
    brands,
    [54, 20, 35, 15, 28],
    manualTimer,
  );
  // underlying is 2 Simoleans, strike range is 30-50 (doubled)
  const terms = harden({
    expiration: 3n,
    underlyingAmount: simoleans(2),
    priceAuthority,
    strikePrice1: moola(60),
    strikePrice2: moola(100),
    settlementAmount: bucks(300),
    timer: manualTimer,
  });

  // Alice creates a fundedCallSpread instance
  const issuerKeywordRecord = harden({
    Underlying: simoleanIssuer,
    Collateral: bucksIssuer,
    Strike: moolaIssuer,
    Quote: await E(priceAuthority).getQuoteIssuer(
      brands.get('simoleans'),
      brands.get('moola'),
    ),
  });
  const { creatorInvitation } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord,
    terms,
  );

  const invitationDetail = await E(zoe).getInvitationDetails(creatorInvitation);
  const longOptionAmount = invitationDetail.longAmount;
  const shortOptionAmount = invitationDetail.shortAmount;

  const aliceProposal = harden({
    want: { LongOption: longOptionAmount, ShortOption: shortOptionAmount },
    give: { Collateral: bucks(300) },
  });
  const alicePayments = { Collateral: aliceBucksPayment };
  const aliceSeat = await E(zoe).offer(
    creatorInvitation,
    aliceProposal,
    alicePayments,
  );
  const {
    LongOption: bobLongOption,
    ShortOption: carolShortOption,
  } = await aliceSeat.getPayouts();

  const bobOptionSeat = await E(zoe).offer(bobLongOption);
  const bobPayout = bobOptionSeat.getPayout('Collateral');
  const bobDeposit = assertPayoutDeposit(t, bobPayout, bobBucksPurse, bucks(0));

  const carolOptionSeat = await E(zoe).offer(carolShortOption);
  const carolPayout = carolOptionSeat.getPayout('Collateral');
  const carolDeposit = assertPayoutDeposit(
    t,
    carolPayout,
    carolBucksPurse,
    bucks(300),
  );

  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await Promise.all([bobDeposit, carolDeposit]);
});

// Underlying is in Simoleans. Collateral, strikePrice and Payout are in bucks.
// Value is in Moola.
test('fundedCallSpread above Strike2', async t => {
  const {
    moolaIssuer,
    simoleanIssuer,
    moola,
    simoleans,
    bucksIssuer,
    bucksMint,
    bucks,
    zoe,
    brands,
  } = setup();
  const installation = await installationPFromSource(zoe, fundedCallSpread);

  // Alice will create and fund a call spread contract, and give the invitations
  // to Bob and Carol. Bob and Carol will promptly schedule collection of funds.
  // The spread will then mature at a high price, and bob will get paid.

  // Setup Alice
  const aliceBucksPayment = bucksMint.mintPayment(bucks(300));
  // Setup Bob
  const bobBucksPurse = bucksIssuer.makeEmptyPurse();
  // Setup Carol
  const carolBucksPurse = bucksIssuer.makeEmptyPurse();

  const manualTimer = buildManualTimer(console.log, 0n);
  const priceAuthority = makeTestPriceAuthority(brands, [20, 55], manualTimer);
  // underlying is 2 Simoleans, strike range is 30-50 (doubled)
  const terms = harden({
    expiration: 3n,
    underlyingAmount: simoleans(2),
    priceAuthority,
    strikePrice1: moola(60),
    strikePrice2: moola(100),
    settlementAmount: bucks(300),
    timer: manualTimer,
  });

  // Alice creates a fundedCallSpread instance
  const issuerKeywordRecord = harden({
    Underlying: simoleanIssuer,
    Collateral: bucksIssuer,
    Strike: moolaIssuer,
  });

  const { creatorInvitation } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord,
    terms,
  );

  const invitationDetail = await E(zoe).getInvitationDetails(creatorInvitation);
  const longOptionAmount = invitationDetail.longAmount;
  const shortOptionAmount = invitationDetail.shortAmount;

  const aliceProposal = harden({
    want: { LongOption: longOptionAmount, ShortOption: shortOptionAmount },
    give: { Collateral: bucks(300) },
  });
  const alicePayments = { Collateral: aliceBucksPayment };
  const aliceSeat = await E(zoe).offer(
    creatorInvitation,
    aliceProposal,
    alicePayments,
  );
  const {
    LongOption: bobLongOption,
    ShortOption: carolShortOption,
  } = await aliceSeat.getPayouts();

  const bobOptionSeat = await E(zoe).offer(bobLongOption);
  const bobPayout = bobOptionSeat.getPayout('Collateral');
  const bobDeposit = assertPayoutDeposit(
    t,
    bobPayout,
    bobBucksPurse,
    bucks(300),
  );

  const carolOptionSeat = await E(zoe).offer(carolShortOption);
  const carolPayout = carolOptionSeat.getPayout('Collateral');
  const carolDeposit = assertPayoutDeposit(
    t,
    carolPayout,
    carolBucksPurse,
    bucks(0),
  );

  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await Promise.all([bobDeposit, carolDeposit]);
});

// Underlying is in Simoleans. Collateral, strikePrice and Payout are in bucks.
// Value is in Moola.
test('fundedCallSpread, mid-strike', async t => {
  const {
    moolaIssuer,
    simoleanIssuer,
    moola,
    simoleans,
    bucksIssuer,
    bucksMint,
    bucks,
    zoe,
    brands,
  } = setup();
  const installation = await installationPFromSource(zoe, fundedCallSpread);

  // Alice will create and fund a call spread contract, and give the invitations
  // to Bob and Carol. Bob and Carol will promptly schedule collection of funds.
  // The spread will then mature, and both will get paid.

  // Setup Alice
  const aliceBucksPayment = bucksMint.mintPayment(bucks(300));
  // Setup Bob
  const bobBucksPurse = bucksIssuer.makeEmptyPurse();
  // Setup Carol
  const carolBucksPurse = bucksIssuer.makeEmptyPurse();

  const manualTimer = buildManualTimer(console.log, 0n);
  const priceAuthority = makeTestPriceAuthority(brands, [20, 45], manualTimer);
  // underlying is 2 Simoleans, strike range is 30-50 (doubled)
  const terms = harden({
    expiration: 3n,
    underlyingAmount: simoleans(2),
    priceAuthority,
    strikePrice1: moola(60),
    strikePrice2: moola(100),
    settlementAmount: bucks(300),
    timer: manualTimer,
  });
  // Alice creates a fundedCallSpread instance
  const issuerKeywordRecord = harden({
    Underlying: simoleanIssuer,
    Collateral: bucksIssuer,
    Strike: moolaIssuer,
  });

  const { creatorInvitation } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord,
    terms,
  );

  const invitationDetail = await E(zoe).getInvitationDetails(creatorInvitation);
  const longOptionAmount = invitationDetail.longAmount;
  const shortOptionAmount = invitationDetail.shortAmount;

  const aliceProposal = harden({
    want: { LongOption: longOptionAmount, ShortOption: shortOptionAmount },
    give: { Collateral: bucks(300) },
  });
  const alicePayments = { Collateral: aliceBucksPayment };
  const aliceSeat = await E(zoe).offer(
    creatorInvitation,
    aliceProposal,
    alicePayments,
  );
  const {
    LongOption: bobLongOption,
    ShortOption: carolShortOption,
  } = await aliceSeat.getPayouts();

  const bobOptionSeat = await E(zoe).offer(bobLongOption);
  const bobPayout = bobOptionSeat.getPayout('Collateral');
  const bobDeposit = assertPayoutDeposit(
    t,
    bobPayout,
    bobBucksPurse,
    bucks(225),
  );

  const carolOptionSeat = await E(zoe).offer(carolShortOption);
  const carolPayout = carolOptionSeat.getPayout('Collateral');
  const carolDeposit = assertPayoutDeposit(
    t,
    carolPayout,
    carolBucksPurse,
    bucks(75),
  );

  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await Promise.all([bobDeposit, carolDeposit]);
});

// Underlying is in Simoleans. Collateral, strikePrice and Payout are in bucks.
// Value is in Moola. Carol waits to collect until after settlement
test('fundedCallSpread, late exercise', async t => {
  const {
    moolaIssuer,
    simoleanIssuer,
    moola,
    simoleans,
    bucksIssuer,
    bucksMint,
    bucks,
    zoe,
    brands,
  } = setup();
  const installation = await installationPFromSource(zoe, fundedCallSpread);

  // Alice will create and fund a call spread contract, and give the invitations
  // to Bob and Carol. Bob and Carol will promptly schedule collection of funds.
  // The spread will then mature, and both will get paid.

  // Setup Alice
  const aliceBucksPayment = bucksMint.mintPayment(bucks(300));
  // Setup Bob
  const bobBucksPurse = bucksIssuer.makeEmptyPurse();
  // Setup Carol
  const carolBucksPurse = bucksIssuer.makeEmptyPurse();

  const manualTimer = buildManualTimer(console.log, 0n);
  const priceAuthority = makeTestPriceAuthority(brands, [20, 45], manualTimer);
  // underlying is 2 Simoleans, strike range is 30-50 (doubled)
  const terms = harden({
    expiration: 3n,
    underlyingAmount: simoleans(2),
    priceAuthority,
    strikePrice1: moola(60),
    strikePrice2: moola(100),
    settlementAmount: bucks(300),
    timer: manualTimer,
  });

  // Alice creates a fundedCallSpread instance
  const issuerKeywordRecord = harden({
    Underlying: simoleanIssuer,
    Collateral: bucksIssuer,
    Strike: moolaIssuer,
  });
  const { creatorInvitation } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord,
    terms,
  );

  const invitationDetails = await E(zoe).getInvitationDetails(
    creatorInvitation,
  );
  const aliceProposal = harden({
    want: {
      LongOption: invitationDetails.longAmount,
      ShortOption: invitationDetails.shortAmount,
    },
    give: { Collateral: bucks(300) },
  });
  const alicePayments = { Collateral: aliceBucksPayment };
  const aliceSeat = await E(zoe).offer(
    creatorInvitation,
    aliceProposal,
    alicePayments,
  );
  const {
    LongOption: bobLongOption,
    ShortOption: carolShortOption,
  } = await aliceSeat.getPayouts();

  const bobOptionSeat = await E(zoe).offer(bobLongOption);
  const bobPayout = bobOptionSeat.getPayout('Collateral');
  const bobDeposit = assertPayoutDeposit(
    t,
    bobPayout,
    bobBucksPurse,
    bucks(225),
  );

  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await E(manualTimer).tick();

  const carolOptionSeat = await E(zoe).offer(carolShortOption);
  const carolPayout = await carolOptionSeat.getPayout('Collateral');
  const carolDepositAmount = await E(carolBucksPurse).deposit(carolPayout);
  await t.deepEqual(
    carolDepositAmount,
    bucks(75),
    `payout was ${carolDepositAmount.value}, expected 75`,
  );
  await Promise.all([bobDeposit]);
});

test('fundedCallSpread, sell options', async t => {
  const {
    moolaIssuer,
    simoleanIssuer,
    moola,
    simoleans,
    bucksIssuer,
    bucksMint,
    bucks,
    zoe,
    brands,
  } = setup();
  const installation = await installationPFromSource(zoe, fundedCallSpread);
  const invitationIssuer = await E(zoe).getInvitationIssuer();

  // Alice will create and fund a call spread contract, and sell the invitations
  // to Bob and Carol. Bob and Carol will promptly schedule collection of funds.
  // The spread will then mature, and both will get paid.

  // Setup Alice
  const aliceBucksPayment = bucksMint.mintPayment(bucks(300));
  const aliceBucksPurse = bucksIssuer.makeEmptyPurse();
  // Setup Bob
  const bobBucksPurse = bucksIssuer.makeEmptyPurse();
  const bobBucksPayment = bucksMint.mintPayment(bucks(200));
  // Setup Carol
  const carolBucksPurse = bucksIssuer.makeEmptyPurse();
  const carolBucksPayment = bucksMint.mintPayment(bucks(100));

  const manualTimer = buildManualTimer(console.log, 0n);
  const priceAuthority = makeTestPriceAuthority(brands, [20, 45], manualTimer);
  // underlying is 2 Simoleans, strike range is 30-50 (doubled)
  const terms = harden({
    expiration: 3n,
    underlyingAmount: simoleans(2),
    priceAuthority,
    strikePrice1: moola(60),
    strikePrice2: moola(100),
    settlementAmount: bucks(300),
    timer: manualTimer,
  });

  // Alice creates a fundedCallSpread instance
  const issuerKeywordRecord = harden({
    Underlying: simoleanIssuer,
    Collateral: bucksIssuer,
    Strike: moolaIssuer,
  });
  const { creatorInvitation } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord,
    terms,
  );

  const invitationDetail = await E(zoe).getInvitationDetails(creatorInvitation);
  const longOptionAmount = invitationDetail.longAmount;
  const shortOptionAmount = invitationDetail.shortAmount;

  const aliceProposal = harden({
    want: { LongOption: longOptionAmount, ShortOption: shortOptionAmount },
    give: { Collateral: bucks(300) },
  });
  const alicePayments = { Collateral: aliceBucksPayment };
  const aliceSeat = await E(zoe).offer(
    creatorInvitation,
    aliceProposal,
    alicePayments,
  );
  const {
    LongOption: longOption,
    ShortOption: shortOption,
  } = await aliceSeat.getPayouts();

  const exchangeInstallation = await installationPFromSource(
    zoe,
    simpleExchange,
  );
  const { publicFacet: exchangePublic } = await E(zoe).startInstance(
    exchangeInstallation,
    {
      Asset: invitationIssuer,
      Price: bucksIssuer,
    },
  );

  // Alice offers to sell the long invitation
  const aliceLongInvitation = E(exchangePublic).makeInvitation();
  const proposalLong = harden({
    give: { Asset: longOptionAmount },
    want: { Price: bucks(200) },
  });
  const aliceSellLongSeat = await E(zoe).offer(
    aliceLongInvitation,
    proposalLong,
    {
      Asset: longOption,
    },
  );
  const aliceLong = assertPayoutDeposit(
    t,
    aliceSellLongSeat.getPayout('Price'),
    aliceBucksPurse,
    bucks(200),
  );

  // Alice offers to sell the short invitation
  const aliceShortInvitation = E(exchangePublic).makeInvitation();
  const proposalShort = harden({
    give: { Asset: shortOptionAmount },
    want: { Price: bucks(100) },
  });
  const aliceSellShortSeat = await E(zoe).offer(
    aliceShortInvitation,
    proposalShort,
    { Asset: shortOption },
  );
  const aliceShort = assertPayoutDeposit(
    t,
    aliceSellShortSeat.getPayout('Price'),
    carolBucksPurse,
    bucks(100),
  );

  // Bob buys the long invitation
  const bobLongInvitation = E(exchangePublic).makeInvitation();
  const bobProposal = harden({
    give: { Price: bucks(200) },
    want: { Asset: longOptionAmount },
  });
  const bobBuySeat = await E(zoe).offer(bobLongInvitation, bobProposal, {
    Price: bobBucksPayment,
  });
  const longInvitationPayout = await bobBuySeat.getPayout('Asset');
  assertPayoutAmount(
    t,
    invitationIssuer,
    longInvitationPayout,
    longOptionAmount,
  );
  const bobOptionSeat = await E(zoe).offer(longInvitationPayout);
  const bobPayout = bobOptionSeat.getPayout('Collateral');
  const bobDeposit = assertPayoutDeposit(
    t,
    bobPayout,
    bobBucksPurse,
    bucks(225),
  );

  // Carol buys the Short invitation
  const carolShortInvitation = E(exchangePublic).makeInvitation();
  const carolProposal = harden({
    give: { Price: bucks(100) },
    want: { Asset: shortOptionAmount },
  });
  const carolBuySeat = await E(zoe).offer(carolShortInvitation, carolProposal, {
    Price: carolBucksPayment,
  });
  const ShortInvitationPayout = await carolBuySeat.getPayout('Asset');
  assertPayoutAmount(
    t,
    invitationIssuer,
    ShortInvitationPayout,
    shortOptionAmount,
  );
  const carolOptionSeat = await E(zoe).offer(ShortInvitationPayout);
  const carolPayout = carolOptionSeat.getPayout('Collateral');
  const carolDeposit = assertPayoutDeposit(
    t,
    carolPayout,
    carolBucksPurse,
    bucks(75),
  );

  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await Promise.all([aliceLong, aliceShort, bobDeposit, carolDeposit]);
});

test('pricedCallSpread, mid-strike', async t => {
  const {
    moolaIssuer,
    simoleanIssuer,
    moola,
    simoleans,
    bucksIssuer,
    bucksMint,
    bucks,
    zoe,
    brands,
  } = setup();
  const installation = await installationPFromSource(zoe, pricedCallSpread);

  // Alice will create a call spread contract, and give the invitations
  // to Bob and Carol. Bob and Carol will fund and exercise, then promptly
  // schedule collection of funds. The spread will then mature, and both will
  // get paid.

  // Setup Bob
  const bobBucksPurse = bucksIssuer.makeEmptyPurse();
  const bobBucksPayment = bucksMint.mintPayment(bucks(225));
  // Setup Carol
  const carolBucksPurse = bucksIssuer.makeEmptyPurse();
  const carolBucksPayment = bucksMint.mintPayment(bucks(75));

  const manualTimer = buildManualTimer(console.log, 0n);
  const priceAuthority = await makeTestPriceAuthority(
    brands,
    [20, 45, 45, 45, 45, 45, 45],
    manualTimer,
  );
  // underlying is 2 Simoleans, strike range is 30-50 (doubled)
  const terms = harden({
    expiration: 3n,
    underlyingAmount: simoleans(2),
    priceAuthority,
    strikePrice1: moola(60),
    strikePrice2: moola(100),
    settlementAmount: bucks(300),
    timer: manualTimer,
  });
  // Alice creates a pricedCallSpread instance
  const issuerKeywordRecord = harden({
    Underlying: simoleanIssuer,
    Collateral: bucksIssuer,
    Strike: moolaIssuer,
  });
  const { creatorFacet } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord,
    terms,
  );
  const invitationPair = await E(creatorFacet).makeInvitationPair(75n);
  const { longInvitation, shortInvitation } = invitationPair;

  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const longAmount = await E(invitationIssuer).getAmountOf(longInvitation);
  const shortAmount = await E(invitationIssuer).getAmountOf(shortInvitation);

  const longOptionValue = longAmount.value[0];
  t.is('long', longOptionValue.position);
  const longOption = longOptionValue.option;

  // Bob makes an offer for the long option
  const bobProposal = harden({
    want: { Option: longOption },
    give: { Collateral: bucks(longOptionValue.collateral) },
  });
  const bobFundingSeat = await E(zoe).offer(await longInvitation, bobProposal, {
    Collateral: bobBucksPayment,
  });
  // bob gets an option, and exercises it for the payout
  const bobOption = await bobFundingSeat.getPayout('Option');
  const bobOptionSeat = await E(zoe).offer(bobOption);

  const bobPayout = bobOptionSeat.getPayout('Collateral');
  const bobDeposit = assertPayoutDeposit(
    t,
    bobPayout,
    bobBucksPurse,
    bucks(225),
  );

  const shortOptionValue = shortAmount.value[0];
  t.is('short', shortOptionValue.position);
  const shortOption = shortOptionValue.option;

  // carol makes an offer for the short option
  const carolProposal = harden({
    want: { Option: shortOption },
    give: { Collateral: bucks(shortOptionValue.collateral) },
  });
  const carolFundingSeat = await E(zoe).offer(
    await shortInvitation,
    carolProposal,
    {
      Collateral: carolBucksPayment,
    },
  );
  // carol gets an option, and exercises it for the payout
  const carolOption = await carolFundingSeat.getPayout('Option');
  const carolOptionSeat = await E(zoe).offer(carolOption);

  const carolPayout = carolOptionSeat.getPayout('Collateral');
  const carolDeposit = assertPayoutDeposit(
    t,
    carolPayout,
    carolBucksPurse,
    bucks(75),
  );

  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await E(manualTimer).tick();
  await Promise.all([bobDeposit, carolDeposit]);
});
