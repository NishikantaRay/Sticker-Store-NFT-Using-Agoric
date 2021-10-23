// @ts-check

// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { Far } from '@agoric/marshal';

import { makeIssuerKit, AssetKind, AmountMath } from '@agoric/ertp';

import { burnInvitation } from '../../../src/zoeService/offer/burnInvitation.js';

test('burnInvitation', async t => {
  const mockInvitationKit = makeIssuerKit('mockInvitation', AssetKind.SET);

  const instanceHandle = Far('handle', {});
  const invitationHandle = Far('handle', {});

  const invitation = mockInvitationKit.mint.mintPayment(
    AmountMath.make(mockInvitationKit.brand, [
      { instance: instanceHandle, handle: invitationHandle },
    ]),
  );

  t.deepEqual(await burnInvitation(mockInvitationKit.issuer, invitation), {
    instanceHandle,
    invitationHandle,
    fee: undefined,
    expiry: undefined,
  });
});

test('burnInvitation - not an invitation', async t => {
  const mockInvitationKit = makeIssuerKit('mockInvitation', AssetKind.SET);

  await t.throwsAsync(
    // @ts-ignore invalid payment for the purposes of testing
    () => burnInvitation(mockInvitationKit.issuer, undefined),
    { message: 'A Zoe invitation is required, not "[undefined]"' },
  );
});

test('burnInvitation - invitation already used', async t => {
  const mockInvitationKit = makeIssuerKit('mockInvitation', AssetKind.SET);

  const instanceHandle = Far('handle', {});
  const invitationHandle = Far('handle', {});

  const invitation = mockInvitationKit.mint.mintPayment(
    AmountMath.make(mockInvitationKit.brand, [
      { instance: instanceHandle, handle: invitationHandle },
    ]),
  );

  t.deepEqual(await burnInvitation(mockInvitationKit.issuer, invitation), {
    instanceHandle,
    invitationHandle,
    fee: undefined,
    expiry: undefined,
  });

  await t.throwsAsync(
    () => burnInvitation(mockInvitationKit.issuer, invitation),
    {
      message:
        'A Zoe invitation is required, not "[Alleged: mockInvitation payment]"',
    },
  );
});

test('burnInvitation - multiple invitations', async t => {
  const mockInvitationKit = makeIssuerKit('mockInvitation', AssetKind.SET);

  const instanceHandle = Far('handle', {});
  const invitationHandle1 = Far('handle', {});
  const invitationHandle2 = Far('handle', {});

  const invitations = mockInvitationKit.mint.mintPayment(
    AmountMath.make(mockInvitationKit.brand, [
      { instance: instanceHandle, handle: invitationHandle1 },
      { instance: instanceHandle, handle: invitationHandle2 },
    ]),
  );

  await t.throwsAsync(
    () => burnInvitation(mockInvitationKit.issuer, invitations),
    {
      message: 'Only one invitation can be redeemed at a time',
    },
  );
});
