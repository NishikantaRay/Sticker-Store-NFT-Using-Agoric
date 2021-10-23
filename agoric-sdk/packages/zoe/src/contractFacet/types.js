// eslint-disable-next-line spaced-comment
/// <reference types="ses"/>

/**
 * @typedef {any} Completion
 * Any passable non-thenable. Often an explanatory string.
 */

/**
 * @callback ZCFMakeEmptySeatKit
 * @param {ExitRule=} exit
 * @returns {ZcfSeatKit}
 */

/**
 * @typedef {Object} ContractFacet
 *
 * The Zoe interface specific to a contract instance. The Zoe Contract
 * Facet is an API object used by running contract instances to access
 * the Zoe state for that instance. The Zoe Contract Facet is accessed
 * synchronously from within the contract, and usually is referred to
 * in code as zcf.
 *
 * @property {Reallocate} reallocate - reallocate amounts among seats
 * @property {(keyword: Keyword) => void} assertUniqueKeyword - check
 * whether a keyword is valid and unique and could be added in
 * `saveIssuer`
 * @property {SaveIssuer} saveIssuer - save an issuer to ZCF and Zoe
 * and get the AmountMath and brand synchronously accessible after
 * saving
 * @property {MakeInvitation} makeInvitation
 * @property {(completion: Completion) => void} shutdown
 * @property {ShutdownWithFailure} shutdownWithFailure
 * @property {Assert} assert
 * @property {() => ERef<ZoeService>} getZoeService
 * @property {() => Issuer} getInvitationIssuer
 * @property {() => Terms} getTerms
 * @property {(issuer: Issuer) => Brand} getBrandForIssuer
 * @property {(brand: Brand) => Issuer} getIssuerForBrand
 * @property {GetAssetKindByBrand} getAssetKind
 * @property {MakeZCFMint} makeZCFMint
 * @property {ZCFRegisterFeeMint} registerFeeMint
 * @property {ZCFMakeEmptySeatKit} makeEmptySeatKit
 * @property {SetTestJig} setTestJig
 * @property {() => void} stopAcceptingOffers
 * @property {() => Instance} getInstance
 */

/**
 * @typedef {(seat1: ZCFSeat, seat2: ZCFSeat, ...seatRest:
 * Array<ZCFSeat>) => void} Reallocate
 *
 * The contract can reallocate over seats, which commits the staged
 * allocation for each seat. On commit, the staged allocation becomes
 * the current allocation and the staged allocation is deleted.
 *
 * The reallocation will only succeed if the reallocation 1) conserves
 * rights (the amounts specified have the same total value as the
 * current total amount), and 2) is 'offer-safe' for all parties
 * involved. All seats that have staged allocations must be included
 * as arguments to `reallocate`, or an error is thrown. Additionally,
 * an error is thrown if any seats included in `reallocate` do not
 * have a staged allocation.
 *
 * The reallocation is partial, meaning that it applies only to the
 * seats passed in as arguments. By induction, if rights conservation
 * and offer safety hold before, they will hold after a safe
 * reallocation, even though we only re-validate for the seats whose
 * allocations will change. Since rights are conserved for the change,
 * overall rights will be unchanged, and a reallocation can only
 * effect offer safety for seats whose allocations change.
 */

/**
 * @callback SaveIssuer
 *
 * Informs Zoe about an issuer and returns a promise for acknowledging
 * when the issuer is added and ready.
 *
 * @param {ERef<Issuer>} issuerP Promise for issuer
 * @param {Keyword} keyword Keyword for added issuer
 * @returns {Promise<IssuerRecord>} Issuer is added and ready
 */

/**
 * @callback MakeInvitation
 *
 * Make a credible Zoe invitation for a particular smart contract
 * indicated by the `instance` in the details of the invitation. Zoe
 * also puts the `installation` and a unique `handle` in the details
 * of the invitation. The contract must provide a `description` for
 * the invitation and should include whatever information is necessary
 * for a potential buyer of the invitation to know what they are
 * getting in the `customProperties`. `customProperties` will be
 * placed in the details of the invitation.
 *
 * @param {OfferHandler=} offerHandler - a contract specific function
 * that handles the offer, such as saving it or performing a trade
 * @param {string} description
 * @param {Object=} customProperties
 * @param {FeeChoice=} relativeFee - If present, Zoe will transform this into
 * an amount of RUN in the invitation details. This is the exact
 * amount Zoe will charge when this invitation is used to make an
 * offer.
 * @param {ExpiryChoice=} relativeExpiry - If present, Zoe will
 * transform this into a timestamp in the invitation details. After
 * that timestamp, the invitation is no longer accepted by Zoe.
 * @returns {Promise<Invitation>}
 */

/**
 * @callback MakeZCFMint
 * @param {Keyword} keyword
 * @param {AssetKind=} assetKind
 * @param {AdditionalDisplayInfo=} displayInfo
 * @returns {Promise<ZCFMint>}
 */

/**
 * @callback ZCFRegisterFeeMint
 * @param {Keyword} keyword
 * @param {FeeMintAccess} allegedFeeMintAccess - an object that
 * purports to be the object that grants access to the fee mint
 * @returns {Promise<ZCFMint>
 */

/**
 * Provide a jig object for testing purposes only.
 *
 * The contract code provides a callback whose return result will
 * be made available to the test that started this contract. The
 * supplied callback will only be called in a testing context,
 * never in production; i.e., it is only called if `testJigSetter`
 * was supplied.
 *
 * If no, \testFn\ is supplied, then an empty jig will be used.
 * An additional `zcf` property set to the current ContractFacet
 * will be appended to the returned jig object (overriding any
 * provided by the `testFn`).
 *
 * @callback SetTestJig
 * @param {() => any} testFn
 * @returns {void}
 */

/**
 * @callback ZCFMintMintGains
 * @param {AmountKeywordRecord} gains
 * @param {ZCFSeat=} zcfSeat
 * @returns {ZCFSeat}
 */

/**
 * @typedef {Object} ZCFMint
 * @property {() => IssuerRecord} getIssuerRecord
 * @property {ZCFMintMintGains} mintGains
 * All the amounts in gains must be of this ZCFMint's brand.
 * The gains' keywords are in the namespace of that seat.
 * Add the gains to that seat's allocation.
 * The resulting state must be offer safe. (Currently, increasing assets can
 * never violate offer safety anyway.)
 *
 * Mint that amount of assets into the pooled purse.
 * If a seat is provided, it is returned. Otherwise a new seat is
 * returned.
 * TODO unimplemented
 * This creation-on-demand is not yet implemented.
 *
 * @property {(losses: AmountKeywordRecord,
 *             zcfSeat: ZCFSeat,
 *            ) => void} burnLosses
 * All the amounts in losses must be of this ZCFMint's brand.
 * The losses' keywords are in the namespace of that seat.
 * Subtract losses from that seat's allocation.
 * The resulting state must be offer safe.
 *
 * Burn that amount of assets from the pooled purse.
 */

/**
 * @callback ZCFSeatFail
 *
 * fail called with the reason for this failure, where reason is
 * normally an instanceof Error.
 * @param {Error} reason
 * @returns {Error}
 */

/**
 * @callback ZCFGetAmountAllocated
 * The brand is used for filling in an empty amount if the `keyword`
 * is not present in the allocation
 * @param {Keyword} keyword
 * @param {Brand=} brand
 * @returns {Amount}
 */

/**
 * @typedef {Object} ZCFSeat
 * @property {() => void} exit
 * @property {ZCFSeatFail} fail
 * @property {() => Notifier<Allocation>} getNotifier
 * @property {() => boolean} hasExited
 * @property {() => ProposalRecord} getProposal
 * @property {ZCFGetAmountAllocated} getAmountAllocated
 * @property {() => Allocation} getCurrentAllocation
 * @property {() => Allocation} getStagedAllocation
 * @property {() => boolean} hasStagedAllocation
 * @property {(newAllocation: Allocation) => boolean} isOfferSafe
 * @property {(amountKeywordRecord: AmountKeywordRecord) => AmountKeywordRecord} incrementBy
 * @property {(amountKeywordRecord: AmountKeywordRecord) => AmountKeywordRecord} decrementBy
 * @property {() => void} clear
 */

/**
 * @typedef {{ zcfSeat: ZCFSeat, userSeat: ERef<UserSeat>}} ZcfSeatKit
 */

/**
 * @callback OfferHandler
 * @param {ZCFSeat} seat
 * @param {Object=} offerArgs
 * @returns {any}
 */

/**
 * @callback ContractStartFn
 * @param {ContractFacet} zcf
 * @param {Object=} privateArgs
 * @returns {ContractStartFnResult}
 */

/**
 * @typedef {Object} ContractStartFnResult
 * @property {Object=} creatorFacet
 * @property {Promise<Invitation>=} creatorInvitation
 * @property {Object=} publicFacet
 */

/**
 * @typedef {'low'} LOW_FEE
 * @typedef {'high'} HIGH_FEE
 * @typedef {'short'} SHORT_EXP
 * @typedef {'long'} LONG_EXP
 */

/**
 * @typedef {LONG_EXP | SHORT_EXP} ExpiryChoice
 */

/**
 * @typedef {LOW_FEE | HIGH_FEE} FeeChoice
 */
