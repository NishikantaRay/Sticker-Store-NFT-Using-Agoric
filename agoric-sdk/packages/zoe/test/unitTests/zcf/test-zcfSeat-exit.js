// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import path from 'path';

import { E } from '@agoric/eventual-send';
import bundleSource from '@agoric/bundle-source';

// noinspection ES6PreferShortImport
import { makeZoeKit } from '../../../src/zoeService/zoe.js';
import { setup } from '../setupBasicMints.js';
import { makeFakeVatAdmin } from '../../../tools/fakeVatAdmin.js';

import '../../../exported.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const contractRoot = `${dirname}/zcfTesterContract.js`;

// Test that if zcfSeat.exit() is thrown (it should not be), Zoe tries
// to provide a helpful error.

test(`zoe - wrongly throw zcfSeat.exit()`, async t => {
  const { moolaIssuer, simoleanIssuer } = setup();
  let testJig;
  const setJig = jig => {
    testJig = jig;
  };
  const { admin: fakeVatAdminSvc, vatAdminState } = makeFakeVatAdmin(setJig);
  const { zoeService } = makeZoeKit(fakeVatAdminSvc);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);

  // pack the contract
  const bundle = await bundleSource(contractRoot);
  // install the contract
  const installation = await E(zoe).install(bundle);

  // Alice creates an instance
  const issuerKeywordRecord = harden({
    Pixels: moolaIssuer,
    Money: simoleanIssuer,
  });

  // eslint-disable-next-line no-unused-vars
  const { creatorFacet } = await E(zoe).startInstance(
    installation,
    issuerKeywordRecord,
  );

  // The contract uses the testJig so the contractFacet
  // is available here for testing purposes
  /** @type {ContractFacet} */
  const zcf = testJig.zcf;

  /** @type {OfferHandler} */
  const throwSeatExit = seat => {
    // @ts-ignore Linting correctly identifies that exit takes no argument.
    throw seat.exit('here is a string');
  };

  const invitation1 = await zcf.makeInvitation(throwSeatExit, 'seat1');

  const userSeat1 = await E(zoe).offer(invitation1);

  await t.throwsAsync(() => E(userSeat1).getOfferResult(), {
    message:
      'If an offerHandler throws, it must provide a reason of type Error, but the reason was undefined. Please fix the contract code to specify a reason for throwing.',
  });
  t.falsy(vatAdminState.getHasExited());

  /** @type {OfferHandler} */
  const throwSeatFail = seat => {
    // @ts-ignore Linting correctly identifies that the argument to
    // fail must be an error, not a string.
    throw seat.fail('here is a string');
  };

  const invitation2 = await zcf.makeInvitation(throwSeatFail, 'seat2');

  const userSeat2 = await E(zoe).offer(invitation2);

  await t.throwsAsync(() => E(userSeat2).getOfferResult(), {
    message: 'here is a string',
  });
  t.falsy(vatAdminState.getHasExited());
});
