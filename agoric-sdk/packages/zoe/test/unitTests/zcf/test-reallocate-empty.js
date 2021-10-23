// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import { AmountMath, AssetKind } from '@agoric/ertp';

import { setupZCFTest } from './setupZcfTest.js';

test(`zcf.reallocate introducing new empty amount`, async t => {
  const { zcf } = await setupZCFTest();
  const { zcfSeat: zcfSeat1 } = zcf.makeEmptySeatKit();
  const { zcfSeat: zcfSeat2 } = zcf.makeEmptySeatKit();
  const zcfMint = await zcf.makeZCFMint('RUN');
  const { brand } = zcfMint.getIssuerRecord();

  // Get the amount allocated on zcfSeat1. It is empty for the RUN brand.
  const allocation = zcfSeat1.getAmountAllocated('RUN', brand);
  t.true(AmountMath.isEmpty(allocation));

  const empty = AmountMath.makeEmpty(brand, AssetKind.NAT);

  // decrementBy empty does not throw, and does not add a keyword
  zcfSeat1.decrementBy({ RUN: empty });
  t.deepEqual(zcfSeat1.getStagedAllocation(), {});

  // Try to incrementBy empty. This succeeds, and the keyword is added
  // with an empty amount.
  zcfSeat1.incrementBy({ RUN: empty });
  zcfSeat2.incrementBy({ RUN: empty });

  zcf.reallocate(zcfSeat1, zcfSeat2);

  t.deepEqual(zcfSeat1.getStagedAllocation(), {
    RUN: empty,
  });
  t.deepEqual(zcfSeat2.getStagedAllocation(), {
    RUN: empty,
  });
});

test(`zcf.reallocate undefined`, async t => {
  const { zcf } = await setupZCFTest();
  const { zcfSeat: zcfSeat1 } = zcf.makeEmptySeatKit();
  const { zcfSeat: zcfSeat2 } = zcf.makeEmptySeatKit();

  // @ts-ignore Deliberate wrong type for testing
  t.throws(() => zcf.reallocate(zcfSeat1, zcfSeat2, undefined), {
    message:
      // TODO: Improve error message if something other than a seat is
      // passed.
      'seat has been exited',
  });
});
