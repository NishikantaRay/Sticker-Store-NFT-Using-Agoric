// @ts-check

// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { makeNotifierKit } from '@agoric/notifier';
import { makeIssuerKit, AmountMath, AssetKind } from '@agoric/ertp';
import { makePriceAuthority } from '../../../../src/contracts/multipoolAutoswap/priceAuthority.js';
import { setup } from '../../setupBasicMints.js';
import buildManualTimer from '../../../../tools/manualTimer.js';

test('multipoolAutoSwap PriceAuthority exception path', async t => {
  const { moolaR, simoleanR } = setup();
  const timer = buildManualTimer(console.log, 0n);
  const { notifier, updater } = makeNotifierKit();

  const quoteKit = makeIssuerKit('quoteIssuer', AssetKind.SET);

  function ersatzQuote(moolaIn, simoleansOut) {
    return {
      amountIn: AmountMath.make(moolaR.brand, moolaIn),
      amountOut: AmountMath.make(simoleanR.brand, simoleansOut),
    };
  }

  const priceAuthority = makePriceAuthority(
    () => ersatzQuote(3, 25),
    () => ersatzQuote(18, 5),
    moolaR.brand,
    simoleanR.brand,
    timer,
    null,
    notifier,
    quoteKit,
  );

  const triggerDoesNot = priceAuthority.quoteWhenLT(
    AmountMath.make(moolaR.brand, 10),
    AmountMath.make(simoleanR.brand, 20),
  );

  triggerDoesNot.then(
    quote => t.fail(` wasn't expecting a call with a quote ${quote}`),
    e => t.fail(` wasn't expecting ${e}`),
  );

  const trigger = priceAuthority.quoteWhenLT(
    AmountMath.make(moolaR.brand, 10),
    AmountMath.make(simoleanR.brand, 30),
  );

  trigger.then(
    quote => {
      t.deepEqual(quote.quoteAmount.brand, quoteKit.brand);
      t.truthy(quote.quoteAmount.value);
      t.truthy(quote.quotePayment);
    },
    e => t.fail(` wasn't expecting ${e}`),
  );

  await updater.updateState(true);
  await timer.tick();
});
