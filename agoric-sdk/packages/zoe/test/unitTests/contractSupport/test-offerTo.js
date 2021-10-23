// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import path from 'path';

import { E } from '@agoric/eventual-send';
import bundleSource from '@agoric/bundle-source';

import { setup } from '../setupBasicMints.js';
import { makeZoeKit } from '../../../src/zoeService/zoe.js';
import { makeFakeVatAdmin } from '../../../tools/fakeVatAdmin.js';
import {
  offerTo,
  assertProposalShape,
  swapExact,
} from '../../../src/contractSupport/zoeHelpers.js';
import { makeOffer } from '../makeOffer.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractRoot = `${dirname}/../zcf/zcfTesterContract.js`;

const setupContract = async (moolaIssuer, bucksIssuer) => {
  const instanceToZCF = new Map();
  const setJig = jig => {
    instanceToZCF.set(jig.instance, jig.zcf);
  };
  const { zoeService } = makeZoeKit(makeFakeVatAdmin(setJig).admin);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);

  // pack the contract
  const bundle = await bundleSource(contractRoot);
  // install the contract
  const installation = await E(zoe).install(bundle);

  // Create TWO instances of the zcfTesterContract which have
  // different keywords
  const issuerKeywordRecord1 = harden({
    TokenJ: moolaIssuer,
    TokenK: bucksIssuer,
  });

  const issuerKeywordRecord2 = harden({
    TokenL: moolaIssuer,
    TokenM: bucksIssuer,
  });

  // contract instance A
  const { instance: instanceA } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord1,
  );

  // contract instance B
  const { instance: instanceB } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord2,
  );

  // instanceToZCF a map containing both instances as keys and zcfs as
  // values
  return { zoe, instanceToZCF, instanceA, instanceB };
};

test(`offerTo - basic usage`, async t => {
  const {
    moola,
    moolaIssuer,
    moolaMint,
    bucksMint,
    bucks,
    bucksIssuer,
  } = setup();
  const { zoe, instanceToZCF, instanceA, instanceB } = await setupContract(
    moolaIssuer,
    bucksIssuer,
  );

  const zcfA = instanceToZCF.get(instanceA);
  const zcfB = instanceToZCF.get(instanceB);

  // Make an offer from contract A to contract B from a seat in
  // contract A, and deposit the winnings in a different seat on contract A.

  // Create a fromSeat on contract instance A that starts with 5 bucks
  // under keyword TokenK

  const { zcfSeat: fromSeatContractA } = await makeOffer(
    zoe,
    zcfA,
    harden({ want: harden({}), give: { TokenK: bucks(5) } }),
    harden({ TokenK: bucksMint.mintPayment(bucks(5)) }),
  );

  // Create a seat in contract instance B to exchange with.

  const { zcfSeat: contractBCollateralSeat } = await makeOffer(
    zoe,
    zcfB,
    harden({ want: { TokenM: bucks(5) }, give: { TokenL: moola(10) } }),
    harden({ TokenL: moolaMint.mintPayment(moola(10)) }),
  );

  // create an invitation for contract instance B. This offer will
  // take the 5 bucks and give 10 moola in exchange.

  const successMsg = 'offer to contractB successful';

  const offerHandler = seat => {
    assertProposalShape(seat, {
      give: {
        TokenM: null,
      },
      want: {
        TokenL: null,
      },
      exit: {
        onDemand: null,
      },
    });

    swapExact(zcfB, contractBCollateralSeat, seat);
    return successMsg;
  };
  const contractBInvitation = zcfB.makeInvitation(
    offerHandler,
    'contractB invitation',
  );

  // Map the keywords in contract A to the keywords in contract B
  const keywordMapping = harden({
    TokenJ: 'TokenL',
    TokenK: 'TokenM',
  });

  const proposal = harden({
    give: {
      TokenM: bucks(5),
    },
    want: {
      TokenL: moola(10),
    },
  });

  const { zcfSeat: toSeatContractA } = zcfA.makeEmptySeatKit();
  t.deepEqual(toSeatContractA.getCurrentAllocation(), {});

  const { userSeatPromise: contractBUserSeat, deposited } = await offerTo(
    zcfA,
    contractBInvitation,
    keywordMapping,
    proposal,
    fromSeatContractA,
    toSeatContractA,
  );

  await deposited;
  // The toSeat successfully got the payout from the offer to Contract
  // Instance B
  t.deepEqual(toSeatContractA.getCurrentAllocation(), {
    TokenJ: moola(10),
    TokenK: bucks(0),
  });

  // The offerResult is as expected
  t.is(await E(contractBUserSeat).getOfferResult(), successMsg);
});

test(`offerTo - violates offer safety of fromSeat`, async t => {
  const { moola, moolaIssuer, bucksMint, bucks, bucksIssuer } = setup();
  const { zoe, instanceToZCF, instanceA, instanceB } = await setupContract(
    moolaIssuer,
    bucksIssuer,
  );

  const zcfA = instanceToZCF.get(instanceA);
  const zcfB = instanceToZCF.get(instanceB);

  // Make an offer from contract A to contract B from a seat in
  // contract A, and deposit the winnings in a different seat on contract A.

  // Create a fromSeat on contract instance A that starts with 5 bucks
  // under keyword TokenK

  const { zcfSeat: fromSeatContractA } = await makeOffer(
    zoe,
    zcfA,
    // Actually enforce offer safety
    harden({ want: { TokenJ: moola(3) }, give: { TokenK: bucks(5) } }),
    harden({ TokenK: bucksMint.mintPayment(bucks(5)) }),
  );

  const offerHandler = () => {};
  const contractBInvitation = zcfB.makeInvitation(
    offerHandler,
    'contractB invitation',
  );

  // Map the keywords in contract A to the keywords in contract B
  const keywordMapping = harden({
    TokenJ: 'TokenL',
    TokenK: 'TokenM',
  });

  const proposal = harden({
    give: {
      TokenM: bucks(5),
    },
    want: {
      TokenL: moola(10),
    },
  });

  const { zcfSeat: toSeatContractA } = zcfA.makeEmptySeatKit();
  t.deepEqual(toSeatContractA.getCurrentAllocation(), {});

  await t.throwsAsync(
    () =>
      offerTo(
        zcfA,
        contractBInvitation,
        keywordMapping,
        proposal,
        fromSeatContractA,
        toSeatContractA,
      ),
    {
      message:
        'Offer safety was violated by the proposed allocation: {"TokenK":{"brand":"[Alleged: bucks brand]","value":"[0n]"},"TokenJ":{"brand":"[Alleged: moola brand]","value":"[0n]"}}. Proposal was {"want":{"TokenJ":{"brand":"[Alleged: moola brand]","value":"[3n]"}},"give":{"TokenK":{"brand":"[Alleged: bucks brand]","value":"[5n]"}},"exit":{"onDemand":null}}',
    },
  );

  t.deepEqual(fromSeatContractA.getCurrentAllocation(), {
    TokenJ: moola(0n),
    TokenK: bucks(5),
  });
  t.falsy(fromSeatContractA.hasExited());
});
