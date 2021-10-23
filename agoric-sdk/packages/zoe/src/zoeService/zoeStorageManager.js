// @ts-check

import { AssetKind, makeIssuerKit } from '@agoric/ertp';
import { Far } from '@agoric/marshal';

import './types.js';
import './internal-types.js';

import { makeIssuerStorage } from '../issuerStorage.js';
import { makeAndStoreInstanceRecord } from '../instanceRecordStorage.js';
import { makeIssuerRecord } from '../issuerRecord.js';
import { makeEscrowStorage } from './escrowStorage.js';
import { createInvitationKit } from './makeInvitation.js';
import { makeInstanceAdminStorage } from './instanceAdminStorage.js';
import { makeInstallationStorage } from './installationStorage.js';
import { refillMeter } from './refillMeter.js';

/**
 * The Zoe Storage Manager encapsulates and composes important
 * capabilities, such as the ability to create a new purse and deposit
 * and withdraw into a purse, according to the Principle of Least
 * Authority. The code for these capabilities is imported from smaller
 * files which should have unit tests. After composing, Zoe Storage
 * Manager divides up the resulting capabilities between those needed
 * by a new contract instance (returned as the result of
 * `makeZoeInstanceStorageManager`) and those needed for other purposes.
 *
 * @param {CreateZCFVat} createZCFVat - the ability to create a new
 * ZCF Vat
 * @param {GetFeeIssuerKit} getFeeIssuerKit
 * @param {ShutdownWithFailure} shutdownZoeVat
 * @param {ChargeZoeFee} chargeZoeFee
 * @param {Amount} getPublicFacetFeeAmount
 * @param {Amount} installFeeAmount
 * @param {ChargeForComputrons} chargeForComputrons
 * @param {ERef<TimerService> | undefined} timeAuthority
 * @param {TranslateFee} translateFee
 * @param {TranslateExpiry} translateExpiry
 * @returns {ZoeStorageManager}
 */
export const makeZoeStorageManager = (
  createZCFVat,
  getFeeIssuerKit,
  shutdownZoeVat,
  chargeZoeFee,
  getPublicFacetFeeAmount,
  installFeeAmount,
  chargeForComputrons,
  timeAuthority,
  translateFee,
  translateExpiry,
) => {
  // issuerStorage contains the issuers that the ZoeService knows
  // about, as well as information about them such as their brand,
  // assetKind, and displayInfo
  const issuerStorage = makeIssuerStorage();
  issuerStorage.instantiate();

  // EscrowStorage holds the purses that Zoe uses for escrow. This
  // object should be closely held and tracked: all of the digital
  // assets that users escrow are contained within these purses.
  const escrowStorage = makeEscrowStorage();

  // In order to participate in a contract, users must have
  // invitations, which are ERTP payments made by Zoe. This code
  // contains the mint capability for invitations.
  const { setupMakeInvitation, invitationIssuer } = createInvitationKit(
    shutdownZoeVat,
    timeAuthority,
    translateFee,
    translateExpiry,
  );

  // Every new instance of a contract creates a corresponding
  // "zoeInstanceAdmin" - an admin facet within the Zoe Service for
  // that particular instance. This code manages the storage of those
  // instanceAdmins
  const {
    getPublicFacet,
    getBrands,
    getIssuers,
    getTerms,
    getInstallationForInstance,
    getInstanceAdmin,
    initInstanceAdmin,
    deleteInstanceAdmin,
  } = makeInstanceAdminStorage(chargeZoeFee, getPublicFacetFeeAmount);

  // Zoe stores "installations" - identifiable bundles of contract
  // code that can be reused again and again to create new contract
  // instances
  const { install, unwrapInstallation } = makeInstallationStorage(
    chargeZoeFee,
    installFeeAmount,
  );

  /** @type {MakeZoeInstanceStorageManager} */
  const makeZoeInstanceStorageManager = async (
    installation,
    customTerms,
    uncleanIssuerKeywordRecord,
    instance,
    feePurse,
  ) => {
    // Clean the issuerKeywordRecord we receive in `startInstance`
    // from the user, and save the issuers in Zoe if they are not
    // already stored there
    const { issuers, brands } = await issuerStorage.storeIssuerKeywordRecord(
      uncleanIssuerKeywordRecord,
    );

    // Create purses for the issuers if they do not already exist
    Object.entries(issuers).forEach(([keyword, issuer]) =>
      escrowStorage.createPurse(issuer, brands[keyword]),
    );

    // The instanceRecord is what the contract code is parameterized
    // with: the particular terms, issuers, and brands used in a
    // contract instance based on the installation. A user can query
    // Zoe to find out the installation, terms, issuers, and brands
    // for a contract instance. Contract code has similar query
    // capabilities from the ZCF side.
    const instanceRecordManager = makeAndStoreInstanceRecord(
      installation,
      instance,
      customTerms,
      issuers,
      brands,
    );

    /** @type {SaveIssuer} */
    const saveIssuer = async (issuerP, keyword) => {
      const issuerRecord = await issuerStorage.storeIssuer(issuerP);
      escrowStorage.createPurse(issuerRecord.issuer, issuerRecord.brand);
      instanceRecordManager.addIssuerToInstanceRecord(keyword, issuerRecord);
      return issuerRecord;
    };

    /** @type {WrapIssuerKitWithZoeMint} */
    const wrapIssuerKitWithZoeMint = (keyword, localIssuerKit) => {
      const {
        mint: localMint,
        issuer: localIssuer,
        brand: localBrand,
        displayInfo: localDisplayInfo,
      } = localIssuerKit;

      const localIssuerRecord = makeIssuerRecord(
        localBrand,
        localIssuer,
        localDisplayInfo,
      );
      issuerStorage.storeIssuerRecord(localIssuerRecord);
      const localPooledPurse = escrowStorage.makeLocalPurse(
        localIssuerRecord.issuer,
        localIssuerRecord.brand,
      );
      instanceRecordManager.addIssuerToInstanceRecord(
        keyword,
        localIssuerRecord,
      );
      /** @type {ZoeMint} */
      const zoeMint = Far('ZoeMint', {
        getIssuerRecord: () => {
          return localIssuerRecord;
        },
        mintAndEscrow: totalToMint => {
          const payment = localMint.mintPayment(totalToMint);
          // Note COMMIT POINT within deposit.
          localPooledPurse.deposit(payment, totalToMint);
        },
        withdrawAndBurn: totalToBurn => {
          // eslint-disable-next-line no-use-before-define
          try {
            // COMMIT POINT
            const payment = localPooledPurse.withdraw(totalToBurn);
            // Note redundant COMMIT POINT within burn.
            localIssuer.burn(payment, totalToBurn);
          } catch (err) {
            // eslint-disable-next-line no-use-before-define
            adminNode.terminateWithFailure(err);
            throw err;
          }
        },
      });
      return zoeMint;
    };

    /** @type {MakeZoeMint} */
    const makeZoeMint = (keyword, assetKind = AssetKind.NAT, displayInfo) => {
      // Local indicates one that zoe itself makes from vetted code,
      // and so can be assumed correct and fresh by zoe.
      const localIssuerKit = makeIssuerKit(
        keyword,
        assetKind,
        displayInfo,
        // eslint-disable-next-line no-use-before-define
        adminNode.terminateWithFailure,
      );
      return wrapIssuerKitWithZoeMint(keyword, localIssuerKit);
    };

    /** @type {RegisterFeeMint} */
    const registerFeeMint = (keyword, allegedFeeMintAccess) => {
      const feeIssuerKit = getFeeIssuerKit(allegedFeeMintAccess);
      return wrapIssuerKitWithZoeMint(keyword, feeIssuerKit);
    };

    /** @type {GetIssuerRecords} */
    const getIssuerRecords = () =>
      issuerStorage.getIssuerRecords(
        // the issuerStorage is a weakStore, so we cannot iterate over
        // it directly. Additionally, we only want to export the
        // issuers used in this contract instance specifically, not
        // all issuers.
        Object.values(instanceRecordManager.getInstanceRecord().terms.issuers),
      );

    const makeInvitation = setupMakeInvitation(instance, installation);

    const { root, adminNode, meter } = await createZCFVat();

    refillMeter(meter, chargeForComputrons, feePurse);

    return harden({
      getTerms: instanceRecordManager.getTerms,
      getIssuers: instanceRecordManager.getIssuers,
      getBrands: instanceRecordManager.getBrands,
      getInstallationForInstance:
        instanceRecordManager.getInstallationForInstance,
      saveIssuer,
      makeZoeMint,
      registerFeeMint,
      getInstanceRecord: instanceRecordManager.getInstanceRecord,
      getIssuerRecords,
      withdrawPayments: escrowStorage.withdrawPayments,
      initInstanceAdmin,
      deleteInstanceAdmin,
      makeInvitation,
      invitationIssuer,
      root,
      adminNode,
    });
  };

  return {
    makeZoeInstanceStorageManager,
    getAssetKindByBrand: issuerStorage.getAssetKindByBrand,
    depositPayments: escrowStorage.depositPayments,
    invitationIssuer,
    install,
    getPublicFacet,
    getBrands,
    getIssuers,
    getTerms,
    getInstallationForInstance,
    getInstanceAdmin,
    unwrapInstallation,
  };
};
