// @ts-check
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/swingset-vat/tools/prepare-test-env-ava.js';

import { getInterfaceOf } from '@agoric/marshal';
import { makeIssuerKit, AmountMath } from '../../src/index.js';

test('interfaces - particular implementation', t => {
  const allegedName = 'bucks';
  const { issuer, brand, mint } = makeIssuerKit(allegedName);
  t.is(getInterfaceOf(issuer), 'Alleged: bucks issuer');
  t.is(getInterfaceOf(brand), 'Alleged: bucks brand');
  t.is(getInterfaceOf(mint), 'Alleged: bucks mint');
  const purse = issuer.makeEmptyPurse();
  t.is(getInterfaceOf(purse), 'Alleged: bucks purse');
  const depositFacet = purse.getDepositFacet();
  t.is(getInterfaceOf(depositFacet), 'Alleged: bucks depositFacet');
  const payment = mint.mintPayment(AmountMath.make(brand, 2n));
  t.is(getInterfaceOf(payment), 'Alleged: bucks payment');
});
