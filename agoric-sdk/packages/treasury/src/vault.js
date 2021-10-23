// @ts-check
import '@agoric/zoe/exported.js';

import { E } from '@agoric/eventual-send';
import {
  assertProposalShape,
  divideBy,
  multiplyBy,
  getAmountOut,
  makeRatioFromAmounts,
} from '@agoric/zoe/src/contractSupport/index.js';
import { makeNotifierKit } from '@agoric/notifier';

import { makeRatio } from '@agoric/zoe/src/contractSupport/ratio.js';
import { AmountMath } from '@agoric/ertp';
import { Far } from '@agoric/marshal';
import { makePromiseKit } from '@agoric/promise-kit';
import { makeInterestCalculator } from './interest.js';

const { details: X, quote: q } = assert;

// a Vault is an individual loan, using some collateralType as the
// collateral, and lending RUN to the borrower

/**
 * Constants for vault state.
 *
 * @typedef {'active' | 'liquidating' | 'closed'} VAULT_STATE
 *
 * @type {{ ACTIVE: 'active', LIQUIDATING: 'liquidating', CLOSED: 'closed' }}
 */
export const VaultState = {
  ACTIVE: 'active',
  LIQUIDATING: 'liquidating',
  CLOSED: 'closed',
};

/** @type {MakeVaultKit} */
export function makeVaultKit(
  zcf,
  manager,
  runMint,
  autoswap,
  priceAuthority,
  loanParamManager,
  startTimeStamp,
) {
  const { updater: uiUpdater, notifier } = makeNotifierKit();
  const {
    zcfSeat: liquidationZcfSeat,
    userSeat: liquidationSeat,
  } = zcf.makeEmptySeatKit(undefined);
  const liquidationPromiseKit = makePromiseKit();

  /** @type {VAULT_STATE} */
  let vaultState = VaultState.ACTIVE;

  function assertVaultIsOpen() {
    assert(vaultState === VaultState.ACTIVE, X`vault must still be active`);
  }

  const collateralBrand = manager.getCollateralBrand();
  // timestamp of most recent update to interest
  let latestInterestUpdate = startTimeStamp;

  // vaultSeat will hold the collateral until the loan is retired. The
  // payout from it will be handed to the user: if the vault dies early
  // (because the StableCoinMachine vat died), they'll get all their
  // collateral back. If that happens, the issuer for the RUN will be dead,
  // so their loan will be worthless.
  const { zcfSeat: vaultSeat } = zcf.makeEmptySeatKit();

  const { brand: runBrand } = runMint.getIssuerRecord();
  let runDebt = AmountMath.makeEmpty(runBrand);
  const interestCalculator = makeInterestCalculator(
    runBrand,
    manager.getInterestRate(),
    manager.getChargingPeriod(),
    manager.getRecordingPeriod(),
  );

  function getCollateralAllocated(seat) {
    return seat.getAmountAllocated('Collateral', collateralBrand);
  }
  function getRunAllocated(seat) {
    return seat.getAmountAllocated('RUN', runBrand);
  }

  function assertVaultHoldsNoRun() {
    assert(
      AmountMath.isEmpty(getRunAllocated(vaultSeat)),
      X`Vault should be empty of RUN`,
    );
  }

  async function maxDebtFor(collateralAmount) {
    const quoteAmount = await E(priceAuthority).quoteGiven(
      collateralAmount,
      runBrand,
    );

    return divideBy(getAmountOut(quoteAmount), manager.getLiquidationMargin());
  }

  async function assertSufficientCollateral(collateralAmount, wantedRun) {
    const maxRun = await maxDebtFor(collateralAmount);
    assert(
      AmountMath.isGTE(maxRun, wantedRun, runBrand),
      X`Requested ${q(wantedRun)} exceeds max ${q(maxRun)}`,
    );
  }

  function getCollateralAmount() {
    // getCollateralAllocated would return final allocations
    return vaultSeat.hasExited()
      ? AmountMath.makeEmpty(collateralBrand)
      : getCollateralAllocated(vaultSeat);
  }

  async function getCollateralizationRatio() {
    const collateralAmount = getCollateralAmount();

    const quoteAmount = await E(priceAuthority).quoteGiven(
      collateralAmount,
      runBrand,
    );

    // TODO: allow Ratios to represent X/0.
    if (AmountMath.isEmpty(runDebt)) {
      return makeRatio(collateralAmount.value, runBrand, 1n);
    }
    const collateralValueInRun = getAmountOut(quoteAmount);
    return makeRatioFromAmounts(collateralValueInRun, runDebt);
  }

  // call this whenever anything changes!
  async function updateUiState() {
    // TODO(123): track down all calls and ensure that they all update a
    // lastKnownCollateralizationRatio (since they all know) so we don't have to
    // await quoteGiven() here
    // [https://github.com/Agoric/dapp-token-economy/issues/123]
    const collateralizationRatio = await getCollateralizationRatio();
    /** @type {UIState} */
    const uiState = harden({
      interestRate: manager.getInterestRate(),
      liquidationRatio: manager.getLiquidationMargin(),
      locked: getCollateralAmount(),
      debt: runDebt,
      collateralizationRatio,
      liquidated: vaultState === VaultState.CLOSED,
      vaultState,
    });

    switch (vaultState) {
      case VaultState.ACTIVE:
      case VaultState.LIQUIDATING:
        uiUpdater.updateState(uiState);
        break;
      case VaultState.CLOSED:
        uiUpdater.finish(uiState);
        break;
      default:
        throw Error(`unreachable vaultState: ${vaultState}`);
    }
  }

  function liquidated(newDebt) {
    runDebt = newDebt;
    vaultState = VaultState.CLOSED;
    updateUiState();
  }

  function liquidating() {
    vaultState = VaultState.LIQUIDATING;
    updateUiState();
  }

  /** @type {OfferHandler} */
  async function closeHook(seat) {
    assertVaultIsOpen();
    assertProposalShape(seat, {
      give: { RUN: null },
      want: { Collateral: null },
    });
    const {
      give: { RUN: runReturned },
      want: { Collateral: _collateralWanted },
    } = seat.getProposal();

    // you're paying off the debt, you get everything back. If you were
    // underwater, we should have liquidated some collateral earlier: we
    // missed our chance.

    // you must pay off the entire remainder but if you offer too much, we won't
    // take more than you owe
    assert(
      AmountMath.isGTE(runReturned, runDebt),
      X`You must pay off the entire debt ${runReturned} > ${runDebt}`,
    );

    // Return any overpayment

    const { zcfSeat: burnSeat } = zcf.makeEmptySeatKit();
    burnSeat.incrementBy(seat.decrementBy({ RUN: runDebt }));
    seat.incrementBy(
      vaultSeat.decrementBy({ Collateral: getCollateralAllocated(vaultSeat) }),
    );
    zcf.reallocate(seat, vaultSeat, burnSeat);
    runMint.burnLosses({ RUN: runDebt }, burnSeat);
    seat.exit();
    burnSeat.exit();
    vaultState = VaultState.CLOSED;
    updateUiState();

    runDebt = AmountMath.makeEmpty(runBrand);
    assertVaultHoldsNoRun();
    vaultSeat.exit();
    liquidationZcfSeat.exit();
    liquidationPromiseKit.resolve('Closed');

    return 'your loan is closed, thank you for your business';
  }

  function makeCloseInvitation() {
    assertVaultIsOpen();
    return zcf.makeInvitation(closeHook, 'CloseVault');
  }

  // The proposal is not allowed to include any keys other than these,
  // usually 'Collateral' and 'RUN'.
  function assertOnlyKeys(proposal, keys) {
    function onlyKeys(clause) {
      return Object.getOwnPropertyNames(clause).every(c => keys.includes(c));
    }

    assert(
      onlyKeys(proposal.give),
      X`extraneous terms in give: ${proposal.give}`,
    );
    assert(
      onlyKeys(proposal.want),
      X`extraneous terms in want: ${proposal.want}`,
    );
  }

  // Calculate the target level for Collateral for the vaultSeat and
  // clientSeat implied by the proposal. If the proposal wants Collateral,
  // transfer that amount from vault to client. If the proposal gives
  // Collateral, transfer the opposite direction. Otherwise, return the current level.
  function TargetCollateralLevels(seat) {
    const proposal = seat.getProposal();
    const startVaultAmount = getCollateralAllocated(vaultSeat);
    const startClientAmount = getCollateralAllocated(seat);
    if (proposal.want.Collateral) {
      return {
        vault: AmountMath.subtract(startVaultAmount, proposal.want.Collateral),
        client: AmountMath.add(startClientAmount, proposal.want.Collateral),
      };
    } else if (proposal.give.Collateral) {
      return {
        vault: AmountMath.add(startVaultAmount, proposal.give.Collateral),
        client: AmountMath.subtract(
          startClientAmount,
          proposal.give.Collateral,
        ),
      };
    } else {
      return {
        vault: startVaultAmount,
        client: startClientAmount,
      };
    }
  }

  function transferCollateral(seat) {
    const proposal = seat.getProposal();
    if (proposal.want.Collateral) {
      seat.incrementBy(
        vaultSeat.decrementBy({ Collateral: proposal.want.Collateral }),
      );
    } else if (proposal.give.Collateral) {
      vaultSeat.incrementBy(
        seat.decrementBy({ Collateral: proposal.give.Collateral }),
      );
    }
  }

  // Calculate the target RUN level for the vaultSeat and clientSeat implied
  // by the proposal. If the proposal wants collateral, transfer that amount
  // from vault to client. If the proposal gives collateral, transfer the
  // opposite direction. Otherwise, return the current level.
  //
  // Since we don't allow the debt to go negative, we will reduce the amount we
  // accept when the proposal says to give more RUN than are owed.
  function targetRunLevels(seat) {
    const clientAllocation = getRunAllocated(seat);
    const proposal = seat.getProposal();
    if (proposal.want.RUN) {
      return {
        vault: AmountMath.makeEmpty(runBrand),
        client: AmountMath.add(clientAllocation, proposal.want.RUN),
      };
    } else if (proposal.give.RUN) {
      // We don't allow runDebt to be negative, so we'll refund overpayments
      const acceptedRun = AmountMath.isGTE(proposal.give.RUN, runDebt)
        ? runDebt
        : proposal.give.RUN;

      return {
        vault: acceptedRun,
        client: AmountMath.subtract(clientAllocation, acceptedRun),
      };
    } else {
      return {
        vault: AmountMath.makeEmpty(runBrand),
        client: clientAllocation,
      };
    }
  }

  function transferRun(seat) {
    const proposal = seat.getProposal();
    if (proposal.want.RUN) {
      seat.incrementBy(vaultSeat.decrementBy({ RUN: proposal.want.RUN }));
    } else if (proposal.give.RUN) {
      // We don't allow runDebt to be negative, so we'll refund overpayments
      const acceptedRun = AmountMath.isGTE(proposal.give.RUN, runDebt)
        ? runDebt
        : proposal.give.RUN;

      vaultSeat.incrementBy(seat.decrementBy({ RUN: acceptedRun }));
    }
  }

  // Calculate the fee, the amount to mint and the resulting debt.
  function loanFee(proposal, runAfter) {
    let newDebt;
    let toMint = AmountMath.makeEmpty(runBrand);
    let fee = AmountMath.makeEmpty(runBrand);
    if (proposal.want.RUN) {
      fee = multiplyBy(proposal.want.RUN, manager.getLoanFee());
      toMint = AmountMath.add(proposal.want.RUN, fee);
      newDebt = AmountMath.add(runDebt, toMint);
    } else if (proposal.give.RUN) {
      newDebt = AmountMath.subtract(runDebt, runAfter.vault);
    } else {
      newDebt = runDebt;
    }
    return { newDebt, toMint, fee };
  }

  /** @param {ZCFSeat} clientSeat */
  async function adjustBalancesHook(clientSeat) {
    assertVaultIsOpen();
    const proposal = clientSeat.getProposal();

    assertOnlyKeys(proposal, ['Collateral', 'RUN']);

    const targetCollateralAmount = TargetCollateralLevels(clientSeat).vault;
    // max debt supported by current Collateral as modified by proposal
    const maxDebtForOriginalTarget = await maxDebtFor(targetCollateralAmount);

    const priceOfCollateralInRun = makeRatioFromAmounts(
      maxDebtForOriginalTarget,
      targetCollateralAmount,
    );

    // After the AWAIT, we retrieve the vault's allocations again.
    const collateralAfter = TargetCollateralLevels(clientSeat);
    const runAfter = targetRunLevels(clientSeat);

    // Calculate the fee, the amount to mint and the resulting debt. We'll
    // verify that the target debt doesn't violate the collateralization ratio,
    // then mint, reallocate, and burn.
    const { fee, toMint, newDebt } = loanFee(proposal, runAfter);

    // Get new balances after calling the priceAuthority, so we can compare
    // to the debt limit based on the new values.
    const vaultCollateral =
      collateralAfter.vault || AmountMath.makeEmpty(collateralBrand);

    // If the collateral decreased, we pro-rate maxDebt
    if (AmountMath.isGTE(targetCollateralAmount, vaultCollateral)) {
      // We can pro-rate maxDebt because the quote is either linear (price is
      // unchanging) or super-linear (meaning it's an AMM. When the volume sold
      // falls, the proceeds fall less than linearly, so this is a conservative
      // choice.)
      const maxDebtAfter = multiplyBy(vaultCollateral, priceOfCollateralInRun);
      assert(
        AmountMath.isGTE(maxDebtAfter, newDebt),
        X`The requested debt ${q(
          newDebt,
        )} is more than the collateralization ratio allows: ${q(maxDebtAfter)}`,
      );

      // When the re-checked collateral was larger than the original amount, we
      // should restart, unless the new debt is less than the original target
      // (in which case, we're fine to proceed with the reallocate)
    } else if (!AmountMath.isGTE(maxDebtForOriginalTarget, newDebt)) {
      return adjustBalancesHook(clientSeat);
    }

    // mint to vaultSeat, then reallocate to reward and client, then burn from
    // vaultSeat. Would using a separate seat clarify the accounting?
    runMint.mintGains({ RUN: toMint }, vaultSeat);
    transferCollateral(clientSeat);
    transferRun(clientSeat);
    manager.reallocateReward(fee, vaultSeat, clientSeat);

    runDebt = newDebt;
    runMint.burnLosses({ RUN: runAfter.vault }, vaultSeat);

    assertVaultHoldsNoRun();

    updateUiState();
    clientSeat.exit();

    return 'We have adjusted your balances, thank you for your business';
  }

  function makeAdjustBalancesInvitation() {
    assertVaultIsOpen();
    return zcf.makeInvitation(adjustBalancesHook, 'AdjustBalances');
  }

  /** @type {OfferHandler} */
  async function openLoan(seat) {
    assert(AmountMath.isEmpty(runDebt), X`vault must be empty initially`);
    // get the payout to provide access to the collateral if the
    // contract abandons
    const {
      give: { Collateral: collateralAmount },
      want: { RUN: wantedRun },
    } = seat.getProposal();

    // todo trigger process() check right away, in case the price dropped while we ran

    const fee = multiplyBy(wantedRun, manager.getLoanFee());
    if (AmountMath.isEmpty(fee)) {
      throw seat.fail(
        Error('loan requested is too small; cannot accrue interest'),
      );
    }

    runDebt = AmountMath.add(wantedRun, fee);
    await assertSufficientCollateral(collateralAmount, runDebt);

    runMint.mintGains({ RUN: runDebt }, vaultSeat);

    seat.incrementBy(vaultSeat.decrementBy({ RUN: wantedRun }));
    vaultSeat.incrementBy(seat.decrementBy({ Collateral: collateralAmount }));
    manager.reallocateReward(fee, vaultSeat, seat);

    updateUiState();

    return { notifier };
  }

  function accrueInterestAndAddToPool(currentTime) {
    const interestKit = interestCalculator.calculateReportingPeriod(
      {
        latestInterestUpdate,
        newDebt: runDebt,
        interest: AmountMath.makeEmpty(runBrand),
      },
      currentTime,
    );

    if (interestKit.latestInterestUpdate === latestInterestUpdate) {
      return AmountMath.makeEmpty(runBrand);
    }

    ({ latestInterestUpdate, newDebt: runDebt } = interestKit);
    updateUiState();
    return interestKit.interest;
  }

  function getDebtAmount() {
    return runDebt;
  }

  /** @type {Vault} */
  const vault = Far('vault', {
    makeAdjustBalancesInvitation,
    makeCloseInvitation,

    // for status/debugging
    getCollateralAmount,
    getDebtAmount,
    getLiquidationSeat: () => liquidationSeat,
    getLiquidationPromise: () => liquidationPromiseKit.promise,
  });

  return harden({
    vault,
    openLoan,
    accrueInterestAndAddToPool,
    vaultSeat,
    liquidating,
    liquidated,
    liquidationPromiseKit,
    liquidationZcfSeat,
  });
}
