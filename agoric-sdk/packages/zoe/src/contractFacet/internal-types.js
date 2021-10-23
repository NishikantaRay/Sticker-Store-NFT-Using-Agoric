// @ts-check

/**
 * @callback MakeZCFZygote
 *
 * Make the ZCF vat in zygote-usable form. First, a generic ZCF is
 * made, then the contract code is evaluated, then a particular
 * instance is made.
 *
 * @param {VatPowers} powers
 * @param {ERef<ZoeService>} zoeService
 * @param {Issuer} invitationIssuer
 * @param {Function | undefined} testJigSetter
 * @param {ERef<FeePurse>} feePurse
 * @returns {ZCFZygote}
 */

/**
 * @typedef ZCFZygote
 * @property {(bundle: SourceBundle) => void} evaluateContract
 * @property {(instanceAdminFromZoe: ERef<ZoeInstanceAdmin>,
 *     instanceRecordFromZoe: InstanceRecord,
 *     issuerStorageFromZoe: IssuerRecords,
 *     privateArgs?: Object,
 * ) => Promise<ExecuteContractResult>} startContract
 */
