// @ts-check

import { E } from '@agoric/eventual-send';
import { AmountMath } from '@agoric/ertp';

export const showPurseBalance = async (purseP, name, log) => {
  try {
    const amount = await E(purseP).getCurrentAmount();
    log(name, ': balance ', amount);
  } catch (err) {
    console.error(err);
  }
};

export const setupIssuers = async (zoe, issuers) => {
  const purses = issuers.map(issuer => E(issuer).makeEmptyPurse());
  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const [moolaIssuer, simoleanIssuer, bucksIssuer] = issuers;
  const [moolaBrand, simoleanBrand, bucksBrand] = await Promise.all(
    issuers.map(issuer => E(issuer).getBrand()),
  );

  const moola = value => AmountMath.make(value, moolaBrand);
  const simoleans = value => AmountMath.make(value, simoleanBrand);
  const bucks = value => AmountMath.make(value, bucksBrand);

  return harden({
    issuers: harden([moolaIssuer, simoleanIssuer]),
    invitationIssuer,
    moolaIssuer,
    simoleanIssuer,
    bucksIssuer,
    moola,
    simoleans,
    bucks,
    purses,
  });
};
