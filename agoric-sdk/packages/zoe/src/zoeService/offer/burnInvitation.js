// @ts-check

import { assert, details as X } from '@agoric/assert';
import { E } from '@agoric/eventual-send';

/**
 * Burn the invitation, assert that only one invitation was burned,
 * and extract and return the instanceHandle and invitationHandle
 *
 * @param {Issuer} invitationIssuer
 * @param {ERef<Payment>} invitation
 * @returns {Promise<{
 *   instanceHandle: Instance,
 *   invitationHandle: InvitationHandle,
 *   fee: Amount | undefined,
 *   expiry: Timestamp | undefined,
 * }>}
 */
export const burnInvitation = (invitationIssuer, invitation) => {
  const handleRejected = reason => {
    const err = assert.error(
      X`A Zoe invitation is required, not ${invitation}`,
    );
    assert.note(err, X`Due to ${reason}`);
    throw err;
  };
  const handleFulfilled = invitationAmount => {
    const invitationValue = invitationAmount.value;
    assert(Array.isArray(invitationValue));
    assert(
      invitationValue.length === 1,
      'Only one invitation can be redeemed at a time',
    );
    const [
      { instance: instanceHandle, handle: invitationHandle, fee, expiry },
    ] = invitationValue;
    return {
      instanceHandle,
      invitationHandle,
      fee,
      expiry,
    };
  };

  return E.when(
    invitationIssuer.burn(invitation),
    handleFulfilled,
    handleRejected,
  );
};
