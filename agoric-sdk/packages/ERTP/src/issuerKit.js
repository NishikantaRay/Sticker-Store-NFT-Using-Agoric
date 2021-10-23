// @ts-check
// @jessie-check

import { assert, details as X } from '@agoric/assert';

import { AssetKind } from './amountMath.js';
import { coerceDisplayInfo } from './displayInfo.js';
import { makeBrand } from './brand.js';
import { makePaymentLedger } from './paymentLedger.js';

import './types.js';

/**
 * @type {MakeIssuerKit}
 */
const makeIssuerKit = (
  allegedName,
  assetKind = AssetKind.NAT,
  displayInfo = harden({}),
  optShutdownWithFailure = undefined,
) => {
  assert.typeof(allegedName, 'string');
  assert(
    Object.values(AssetKind).includes(assetKind),
    X`The assetKind ${assetKind} must be either AssetKind.NAT or AssetKind.SET`,
  );

  // Add assetKind to displayInfo, or override if present
  const cleanDisplayInfo = coerceDisplayInfo(displayInfo, assetKind);

  /**
   * We can define this function to use the in-scope `issuer` variable
   * before that variable is initialized, as long as the variable is
   * initialized before the function is called.
   *
   * @param {Issuer} allegedIssuer
   * @returns {boolean}
   */
  // eslint-disable-next-line no-use-before-define
  const isMyIssuerNow = allegedIssuer => allegedIssuer === issuer;

  const brand = makeBrand(allegedName, isMyIssuerNow, cleanDisplayInfo);

  // Attenuate the powerful authority to mint and change balances
  const { issuer, mint } = makePaymentLedger(
    allegedName,
    brand,
    assetKind,
    cleanDisplayInfo,
    optShutdownWithFailure,
  );

  return harden({
    brand,
    issuer,
    mint,
    displayInfo: cleanDisplayInfo,
  });
};

harden(makeIssuerKit);

export { makeIssuerKit };
