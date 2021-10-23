// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import '@agoric/zoe/tools/prepare-test-env-ava.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava'; // TODO ses-ava doesn't yet have test.todo
import path from 'path';

import '../../../../exported.js';

import { E } from '@agoric/eventual-send';
import { AmountMath } from '@agoric/ertp';
import bundleSource from '@agoric/bundle-source';
import { makeNotifierKit } from '@agoric/notifier';

import { checkDetails, checkPayout } from './helpers.js';
import { setup } from '../../setupBasicMints.js';
import { makeFakePriceAuthority } from '../../../../tools/fakePriceAuthority.js';
import buildManualTimer from '../../../../tools/manualTimer.js';
import { makeRatio } from '../../../../src/contractSupport/index.js';

const filename = new URL(import.meta.url).pathname;
const dirname = path.dirname(filename);

const loanRoot = `${dirname}/../../../../src/contracts/loan/`;
const autoswapRoot = `${dirname}/../../../../src/contracts/autoswap`;

test.todo('loan - no mmr');
test.todo('loan - bad mmr');
test.todo('loan - no priceAuthority');
test.todo('loan - badPriceAuthority');
test.todo('loan - bad autoswap, no autoswap');
test.todo('loan - wrong keywords');

test.todo('loan - lend - wrong exit rule');
test.todo('loan - lend - must want nothing');

test('loan - lend - exit before borrow', async t => {
  const { moolaKit: collateralKit, simoleanKit: loanKit, zoe } = setup();
  const bundle = await bundleSource(loanRoot);
  const installation = await E(zoe).install(bundle);

  // Create autoswap installation and instance
  const autoswapBundle = await bundleSource(autoswapRoot);
  const autoswapInstallation = await E(zoe).install(autoswapBundle);

  const { instance: autoswapInstance } = await E(zoe).startInstance(
    autoswapInstallation,
    harden({ Central: collateralKit.issuer, Secondary: loanKit.issuer }),
  );

  const issuerKeywordRecord = harden({
    Collateral: collateralKit.issuer,
    Loan: loanKit.issuer,
  });

  const timer = buildManualTimer(console.log);

  const priceAuthority = makeFakePriceAuthority({
    priceList: [],
    timer,
    actualBrandIn: collateralKit.brand,
    actualBrandOut: loanKit.brand,
  });

  const { notifier: periodNotifier } = makeNotifierKit();

  const terms = {
    mmr: makeRatio(150n, loanKit.brand),
    autoswapInstance,
    priceAuthority,
    periodNotifier,
    interestRate: 5n,
    interestPeriod: 10n,
  };

  const { creatorInvitation: lendInvitation, instance } = await E(
    zoe,
  ).startInstance(installation, issuerKeywordRecord, terms);

  const maxLoan = AmountMath.make(1000n, loanKit.brand);

  // Alice is willing to lend Loan tokens
  const proposal = harden({
    give: { Loan: maxLoan },
  });

  const payments = harden({
    Loan: loanKit.mint.mintPayment(maxLoan),
  });

  const lenderSeat = await E(zoe).offer(lendInvitation, proposal, payments);

  const borrowInvitation = await E(lenderSeat).getOfferResult();

  await checkDetails(t, zoe, borrowInvitation, {
    description: 'borrow',
    handle: null,
    installation,
    instance,
    maxLoan,
    fee: undefined,
    expiry: undefined,
    zoeTimeAuthority: undefined,
  });

  await E(lenderSeat).tryExit();

  // Usually, the payout is received when either 1) the loan is repaid or 2) the
  // collateral is liquidated.
  await checkPayout(t, lenderSeat, 'Loan', loanKit, maxLoan);
});
