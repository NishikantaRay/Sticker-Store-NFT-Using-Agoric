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

test(`zoe - zcfSeat.fail() doesn't throw`, async t => {
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

  let firstSeat;

  const grabSeat = seat => {
    firstSeat = seat;
    return 'ok';
  };

  const failSeat = secondSeat => {
    firstSeat.fail(new Error('first seat failed'));
    throw secondSeat.fail(new Error('second seat failed'));
  };

  const invitation1 = await zcf.makeInvitation(grabSeat, 'seat1');
  const invitation2 = await zcf.makeInvitation(failSeat, 'seat2');

  const userSeat1 = await E(zoe).offer(invitation1);
  const userSeat2 = await E(zoe).offer(invitation2);

  t.is(await E(userSeat1).getOfferResult(), 'ok', `userSeat1 offer result`);

  t.deepEqual(await E(userSeat2).getPayouts(), {});

  await t.throwsAsync(E(userSeat2).getOfferResult(), {
    message: 'second seat failed',
  });
  await t.throwsAsync(() => E(userSeat1).tryExit(), {
    message: 'seat has been exited',
  });
  t.falsy(vatAdminState.getHasExited());
});
