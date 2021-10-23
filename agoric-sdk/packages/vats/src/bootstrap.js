// @ts-check
import { allComparable } from '@agoric/same-structure';
import {
  makeLoopbackProtocolHandler,
  makeEchoConnectionHandler,
  makeNonceMaker,
} from '@agoric/swingset-vat/src/vats/network/index.js';
import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';
import { makeStore } from '@agoric/store';
import { installOnChain as installTreasuryOnChain } from '@agoric/treasury/bundles/install-on-chain.js';
import { installOnChain as installPegasusOnChain } from '@agoric/pegasus/bundles/install-on-chain.js';

import { makePluginManager } from '@agoric/swingset-vat/src/vats/plugin-manager.js';
import { assert, details as X } from '@agoric/assert';
import { makeRatio } from '@agoric/zoe/src/contractSupport/index.js';
import { AmountMath, AssetKind } from '@agoric/ertp';
import { Nat } from '@agoric/nat';
import { makeBridgeManager } from './bridge.js';
import { makeNameHubKit } from './nameHub.js';
import {
  CENTRAL_ISSUER_NAME,
  demoIssuerEntries,
  fromCosmosIssuerEntries,
} from './issuers';

const NUM_IBC_PORTS = 3;
const QUOTE_INTERVAL = 5 * 60;

const BASIS_POINTS_DENOM = 10000n;

console.debug(`loading bootstrap.js`);

// Used for coordinating on an index in comms for the provisioning service
const PROVISIONER_INDEX = 1;

function makeVattpFrom(vats) {
  const { vattp, comms } = vats;
  return Far('vattp', {
    makeNetworkHost(allegedName, console = undefined) {
      return E(vattp).makeNetworkHost(allegedName, comms, console);
    },
  });
}

const CENTRAL_DENOM_NAME = 'urun';
export function buildRootObject(vatPowers, vatParameters) {
  const { D } = vatPowers;
  async function setupCommandDevice(httpVat, cmdDevice, roles) {
    await E(httpVat).setCommandDevice(cmdDevice, roles);
    D(cmdDevice).registerInboundHandler(httpVat);
  }

  // Make services that are provided on the real or virtual chain side
  async function makeChainBundler(
    vats,
    bridgeManager,
    timerDevice,
    vatAdminSvc,
    noFakeCurrencies,
  ) {
    /** @type {ERef<ReturnType<import('./vat-bank')['buildRootObject']>>} */
    const bankVat = vats.bank;

    // Name these differently to distinguish their uses.
    // TODO: eventually make these different facets of the bridgeManager,
    // binding to srcIDs/dstIDs 'bank' and 'dibc' respectively.
    const bankBridgeManager = bridgeManager;
    const dibcBridgeManager = bridgeManager;

    const chainTimerServiceP = E(vats.timer).createTimerService(timerDevice);

    const feeIssuerConfig = {
      name: CENTRAL_ISSUER_NAME,
      assetKind: AssetKind.NAT,
      displayInfo: { decimalPlaces: 6, assetKind: AssetKind.NAT },
      initialFunds: 1_000_000_000_000_000_000n,
    };
    const zoeFeesConfig = {
      getPublicFacetFee: 50n,
      installFee: 65_000n,
      startInstanceFee: 5_000_000n,
      offerFee: 65_000n,
      timeAuthority: chainTimerServiceP,
      lowFee: 500_000n,
      highFee: 5_000_000n,
      shortExp: 1000n * 60n * 5n, // 5 min in milliseconds
      longExp: 1000n * 60n * 60n * 24n * 1n, // 1 day in milliseconds
    };
    const meteringConfig = {
      incrementBy: 25_000_000n,
      initial: 50_000_000n,
      threshold: 25_000_000n,
      price: {
        feeNumerator: 1n,
        computronDenominator: 1n, // default is just one-to-one
      },
    };

    // Create singleton instances.
    const [
      bankManager,
      sharingService,
      board,
      chainTimerService,
      { zoeService: zoe, feeMintAccess, feeCollectionPurse },
      { priceAuthority, adminFacet: priceAuthorityAdmin },
      walletManager,
    ] = await Promise.all([
      E(bankVat).makeBankManager(bankBridgeManager),
      E(vats.sharing).getSharingService(),
      E(vats.board).getBoard(),
      chainTimerServiceP,
      /** @type {Promise<{ zoeService: ZoeServiceFeePurseRequired, feeMintAccess:
       * FeeMintAccess, feeCollectionPurse: FeePurse }>} */ (E(
        vats.zoe,
      ).buildZoe(vatAdminSvc, feeIssuerConfig, zoeFeesConfig, meteringConfig)),
      E(vats.priceAuthority).makePriceAuthority(),
      E(vats.walletManager).buildWalletManager(vatAdminSvc),
    ]);

    const zoeWUnlimitedPurse = E(zoe).bindDefaultFeePurse(feeCollectionPurse);

    const {
      nameHub: agoricNames,
      nameAdmin: agoricNamesAdmin,
    } = makeNameHubKit();
    const {
      nameHub: namesByAddress,
      nameAdmin: namesByAddressAdmin,
    } = makeNameHubKit();
    const {
      nameHub: pegasusConnections,
      nameAdmin: pegasusConnectionsAdmin,
    } = makeNameHubKit();

    async function installEconomy(bootstrapPaymentValue) {
      // Create a mapping from all the nameHubs we create to their corresponding
      // nameAdmin.
      /** @type {Store<NameHub, NameAdmin>} */
      const nameAdmins = makeStore('nameHub');
      await Promise.all(
        ['brand', 'installation', 'issuer', 'instance', 'uiConfig'].map(
          async nm => {
            const { nameHub, nameAdmin } = makeNameHubKit();
            await E(agoricNamesAdmin).update(nm, nameHub);
            nameAdmins.init(nameHub, nameAdmin);
            if (nm === 'uiConfig') {
              // Reserve the Treasury's config until we've populated it.
              nameAdmin.reserve('Treasury');
            }
          },
        ),
      );

      // Install the economy, giving the components access to the name admins we made.
      const [treasuryCreator] = await Promise.all([
        installTreasuryOnChain({
          agoricNames,
          board,
          centralName: CENTRAL_ISSUER_NAME,
          chainTimerService,
          nameAdmins,
          priceAuthority,
          zoeWPurse: zoeWUnlimitedPurse,
          bootstrapPaymentValue,
          feeMintAccess,
        }),
        installPegasusOnChain({
          agoricNames,
          board,
          nameAdmins,
          namesByAddress,
          zoeWPurse: zoeWUnlimitedPurse,
        }),
      ]);
      return treasuryCreator;
    }

    // We'll usually have something like:
    // {
    //   type: 'AG_COSMOS_INIT',
    //   chainID: 'agoric',
    //   storagePort: 1,
    //   supplyCoins: [
    //     { denom: 'provisionpass', amount: '100' },
    //     { denom: 'sendpacketpass', amount: '100' },
    //     { denom: 'ubld', amount: '1000000000000000' },
    //     { denom: 'urun', amount: '50000000000' }
    //   ]
    //   vbankPort: 3,
    //   vibcPort: 2
    // }
    const { supplyCoins = [] } =
      (vatParameters && vatParameters.argv && vatParameters.argv.bootMsg) || {};

    const centralBootstrapSupply = supplyCoins.find(
      ({ denom }) => denom === CENTRAL_DENOM_NAME,
    ) || { amount: '0' };

    // Now we can bootstrap the economy!
    const bootstrapPaymentValue = Nat(BigInt(centralBootstrapSupply.amount));
    // NOTE: no use of the voteCreator. We'll need it to initiate votes on
    // changing Treasury parameters.
    const { treasuryCreator, _voteCreator } = await installEconomy(
      bootstrapPaymentValue,
    );

    const [
      centralIssuer,
      centralBrand,
      ammInstance,
      pegasusInstance,
    ] = await Promise.all([
      E(agoricNames).lookup('issuer', CENTRAL_ISSUER_NAME),
      E(agoricNames).lookup('brand', CENTRAL_ISSUER_NAME),
      E(agoricNames).lookup('instance', 'autoswap'),
      E(agoricNames).lookup('instance', 'Pegasus'),
    ]);

    // Start the reward distributor.
    const epochTimerService = chainTimerService;
    const distributorParams = {
      epochInterval: 60n * 60n, // 1 hour
    };
    const feeCollectorDepositFacet = await E(bankManager)
      .getFeeCollectorDepositFacet(CENTRAL_DENOM_NAME, {
        issuer: centralIssuer,
        brand: centralBrand,
      })
      .catch(e => {
        console.log('Cannot create fee collector', e);
        return undefined;
      });
    if (feeCollectorDepositFacet) {
      // Only distribute fees if there is a collector.
      E(vats.distributeFees)
        .buildDistributor(
          E(vats.distributeFees).makeTreasuryFeeCollector(
            zoeWUnlimitedPurse,
            treasuryCreator,
          ),
          feeCollectorDepositFacet,
          epochTimerService,
          harden(distributorParams),
        )
        .catch(e => console.error('Error distributing fees', e));
    }

    /**
     * @type {Store<Brand, Payment>} The store of payments that aren't actually
     * used by the bank.
     */
    const unusedBankPayments = makeStore('brand');

    /* Prime the bank vat with our bootstrap payment. */
    const centralBootstrapPayment = await E(
      treasuryCreator,
    ).getBootstrapPayment(AmountMath.make(centralBrand, bootstrapPaymentValue));

    if (!bankBridgeManager) {
      unusedBankPayments.init(centralBrand, centralBootstrapPayment);
    }

    /** @type {Array<[string, import('./issuers').IssuerInitializationRecord]>} */
    const rawIssuerEntries = [
      ...fromCosmosIssuerEntries({
        issuer: centralIssuer,
        brand: centralBrand,
        bankDenom: CENTRAL_DENOM_NAME,
        bankPayment: centralBootstrapPayment,
      }),
      // We still create demo currencies, but not obviously fake ones unless
      // $FAKE_CURRENCIES is given.
      ...demoIssuerEntries(noFakeCurrencies),
    ];

    const issuerEntries = await Promise.all(
      rawIssuerEntries.map(async entry => {
        const [issuerName, record] = entry;
        if (record.issuer !== undefined) {
          return entry;
        }
        /** @type {Issuer} */
        const issuer = await E(vats.mints).makeMintAndIssuer(
          issuerName,
          ...(record.issuerArgs || []),
        );
        const brand = await E(issuer).getBrand();

        const newRecord = harden({ ...record, brand, issuer });

        /** @type {[string, typeof newRecord]} */
        const newEntry = [issuerName, newRecord];
        return newEntry;
      }),
    );

    // Add bank assets.
    await Promise.all(
      issuerEntries.map(async entry => {
        const [issuerName, record] = entry;
        const { bankDenom, bankPurse, brand, issuer, bankPayment } = record;
        if (!bankDenom || !bankPurse) {
          return undefined;
        }

        assert(brand);
        assert(issuer);

        const makeMintKit = async () => {
          // We need to obtain the mint in order to mint the tokens when they
          // come from the bank.
          // FIXME: Be more careful with the mint.
          const mint = await E(vats.mints).getMint(issuerName);
          return harden({ brand, issuer, mint });
        };

        let kitP;
        if (bankBridgeManager && bankPayment) {
          // The bank needs the payment to back its existing bridge peg.
          kitP = harden({ brand, issuer, payment: bankPayment });
        } else if (unusedBankPayments.has(brand)) {
          // No need to back the currency.
          kitP = harden({ brand, issuer });
        } else {
          kitP = makeMintKit();
        }

        const kit = await kitP;
        return E(bankManager).addAsset(bankDenom, issuerName, bankPurse, kit);
      }),
    );

    async function addAllCollateral() {
      const govBrand = await E(agoricNames).lookup(
        'brand',
        'TreasuryGovernance',
      );
      return Promise.all(
        issuerEntries.map(async entry => {
          const [issuerName, record] = entry;
          const config = record.collateralConfig;
          if (!config) {
            return undefined;
          }
          assert(record.tradesGivenCentral);
          const initialPrice = record.tradesGivenCentral[0];
          assert(initialPrice);
          const rates = {
            initialPrice: makeRatio(
              /** @type {bigint} */ (initialPrice[0]),
              centralBrand,
              /** @type {bigint} */ (initialPrice[1]),
              record.brand,
            ),
            initialMargin: makeRatio(config.initialMarginPercent, centralBrand),
            liquidationMargin: makeRatio(
              config.liquidationMarginPercent,
              centralBrand,
            ),
            interestRate: makeRatio(
              config.interestRateBasis,
              centralBrand,
              BASIS_POINTS_DENOM,
            ),
            loanFee: makeRatio(
              config.loanFeeBasis,
              centralBrand,
              BASIS_POINTS_DENOM,
            ),
          };

          const addTypeInvitation = E(treasuryCreator).makeAddTypeInvitation(
            record.issuer,
            config.keyword,
            rates,
          );

          const payments = E(vats.mints).mintInitialPayments(
            [issuerName],
            [config.collateralValue],
          );
          const payment = E.get(payments)[0];

          assert(record.issuer);
          const amount = await E(record.issuer).getAmountOf(payment);
          const proposal = harden({
            give: {
              Collateral: amount,
            },
            want: {
              // We just throw away our governance tokens.
              Governance: AmountMath.makeEmpty(govBrand, AssetKind.NAT),
            },
          });
          const paymentKeywords = harden({
            Collateral: payment,
          });
          const seat = E(zoeWUnlimitedPurse).offer(
            addTypeInvitation,
            proposal,
            paymentKeywords,
          );
          const vaultManager = E(seat).getOfferResult();
          return vaultManager;
        }),
      );
    }

    /**
     * @param {ERef<Issuer>} issuerIn
     * @param {ERef<Issuer>} issuerOut
     * @param {ERef<Brand>} brandIn
     * @param {ERef<Brand>} brandOut
     * @param {Array<[bigint | number, bigint | number]>} tradeList
     */
    const makeFakePriceAuthority = (
      issuerIn,
      issuerOut,
      brandIn,
      brandOut,
      tradeList,
    ) =>
      E(vats.priceAuthority).makeFakePriceAuthority({
        issuerIn,
        issuerOut,
        actualBrandIn: brandIn,
        actualBrandOut: brandOut,
        tradeList,
        timer: chainTimerService,
        quoteInterval: QUOTE_INTERVAL,
      });

    const [ammPublicFacet, pegasus] = await Promise.all(
      [ammInstance, pegasusInstance].map(instance =>
        E(zoeWUnlimitedPurse).getPublicFacet(instance),
      ),
    );
    await addAllCollateral();

    const brandsWithPriceAuthorities = await E(
      ammPublicFacet,
    ).getAllPoolBrands();

    await Promise.all(
      issuerEntries.map(async entry => {
        // Create priceAuthority pairs for centralIssuer based on the
        // AMM or FakePriceAuthority.
        const [issuerName, record] = entry;
        console.debug(`Creating ${issuerName}-${CENTRAL_ISSUER_NAME}`);
        const { tradesGivenCentral, issuer } = record;

        assert(issuer);
        const brand = await E(issuer).getBrand();
        let toCentral;
        let fromCentral;

        if (brandsWithPriceAuthorities.includes(brand)) {
          ({ toCentral, fromCentral } = await E(ammPublicFacet)
            .getPriceAuthorities(brand)
            .catch(_e => {
              // console.warn('could not get AMM priceAuthorities', _e);
              return {};
            }));
        }

        if (!fromCentral && tradesGivenCentral) {
          // We have no amm from-central price authority, make one from trades.
          if (issuerName !== CENTRAL_ISSUER_NAME) {
            console.log(
              `Making fake price authority for ${CENTRAL_ISSUER_NAME}-${issuerName}`,
            );
          }
          fromCentral = makeFakePriceAuthority(
            centralIssuer,
            issuer,
            centralBrand,
            brand,
            tradesGivenCentral,
          );
        }

        if (!toCentral && centralIssuer !== issuer && tradesGivenCentral) {
          // We have no amm to-central price authority, make one from trades.
          console.log(
            `Making fake price authority for ${issuerName}-${CENTRAL_ISSUER_NAME}`,
          );
          /** @type {Array<[bigint | number, bigint | number]>} */
          const tradesGivenOther = tradesGivenCentral.map(
            ([valueCentral, valueOther]) => [valueOther, valueCentral],
          );
          toCentral = makeFakePriceAuthority(
            issuer,
            centralIssuer,
            brand,
            centralBrand,
            tradesGivenOther,
          );
        }

        // Register the price pairs.
        await Promise.all(
          [
            [fromCentral, centralBrand, brand],
            [toCentral, brand, centralBrand],
          ].map(async ([pa, fromBrand, toBrand]) => {
            const paPresence = await pa;
            if (!paPresence) {
              return;
            }
            await E(priceAuthorityAdmin).registerPriceAuthority(
              paPresence,
              fromBrand,
              toBrand,
            );
          }),
        );
      }),
    );

    // This needs to happen after creating all the services.
    // eslint-disable-next-line no-use-before-define
    await registerNetworkProtocols(
      vats,
      dibcBridgeManager,
      pegasus,
      pegasusConnectionsAdmin,
    );

    /** @type {ERef<Protocol>} */
    const network = vats.network;
    return Far('chainBundler', {
      async createUserBundle(_nickname, address, powerFlags = []) {
        // Bind to some fresh ports (unspecified name) on the IBC implementation
        // and provide them for the user to have.
        const ibcport = [];
        for (let i = 0; i < NUM_IBC_PORTS; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          const port = await E(network).bind('/ibc-port/');
          ibcport.push(port);
        }

        /** @type {{ issuerName: string, purseName: string, issuer: Issuer,
         * brand: Brand, payment: Payment, payToBank: boolean }[]} */
        const userPaymentRecords = [];
        await Promise.all(
          issuerEntries.map(async entry => {
            const [issuerName, record] = entry;
            if (!record.defaultPurses) {
              return;
            }
            const { issuer, brand, bankPurse } = record;
            assert(issuer);
            assert(brand);

            await Promise.all(
              record.defaultPurses.map(async ([purseName, value]) => {
                // Only pay to the bank if we don't have an actual bridge to the
                // underlying chain (from which we'll get the assets).
                let payToBank = false;
                if (purseName === bankPurse) {
                  if (bankBridgeManager) {
                    // Don't mint or pay if we have a separate bank layer.
                    // We'll obtain the assets from the bank layer.
                    return;
                  }
                  payToBank = true;
                }

                const splitUnusedBankPayment = async () => {
                  if (!payToBank || !unusedBankPayments.has(brand)) {
                    return undefined;
                  }
                  // We have an unusedPayment, so we can split off a payment.
                  const amount = AmountMath.make(brand, Nat(value));
                  const [fragment, remaining] = await E(issuer).split(
                    unusedBankPayments.get(brand),
                    amount,
                  );
                  unusedBankPayments.set(brand, remaining);
                  return fragment;
                };

                const getPayment = async () => {
                  const unused = await splitUnusedBankPayment();
                  if (unused) {
                    return unused;
                  }

                  const [minted] = await E(vats.mints).mintInitialPayments(
                    [issuerName],
                    [value],
                  );
                  return minted;
                };

                const payment = await getPayment();
                userPaymentRecords.push({
                  issuerName,
                  issuer,
                  brand,
                  purseName,
                  payment,
                  payToBank,
                });
              }),
            );
          }),
        );

        const bank = await E(bankManager).getBankForAddress(address);

        // Separate out the purse-creating payments from the bank payments.
        const faucetPaymentInfo = [];
        await Promise.all(
          userPaymentRecords.map(async precord => {
            const {
              payToBank,
              issuer,
              issuerName,
              payment,
              brand,
              purseName,
            } = precord;
            if (!payToBank) {
              // Just a faucet payment to be claimed by a wallet.
              faucetPaymentInfo.push({
                issuer,
                issuerPetname: issuerName,
                payment,
                brand,
                pursePetname: purseName,
              });
              return;
            }

            // Deposit the payment in the bank now.
            assert(brand);
            const purse = E(bank).getPurse(brand);
            await E(purse).deposit(payment);
          }),
        );

        const userFeePurse = await E(zoe).makeFeePurse();
        const zoeWUserFeePurse = await E(zoe).bindDefaultFeePurse(userFeePurse);

        const faucet = Far('faucet', {
          // A method to reap the spoils of our on-chain provisioning.
          async tapFaucet() {
            return faucetPaymentInfo;
          },
          getFeePurse() {
            return userFeePurse;
          },
        });

        // Create a name hub for this address.
        const {
          nameHub: myAddressNameHub,
          nameAdmin: rawMyAddressNameAdmin,
        } = makeNameHubKit();
        // Register it with the namesByAddress hub.
        namesByAddressAdmin.update(address, myAddressNameHub);

        /** @type {MyAddressNameAdmin} */
        const myAddressNameAdmin = Far('myAddressNameAdmin', {
          ...rawMyAddressNameAdmin,
          getMyAddress() {
            return address;
          },
        });

        const makeChainWallet = () =>
          E(walletManager).makeWallet({
            bank,
            feePurse: userFeePurse,
            agoricNames,
            namesByAddress,
            myAddressNameAdmin,
            zoe: zoeWUserFeePurse,
            board,
            localTimerService: chainTimerService,
          });

        const additionalPowers = {};
        const powerFlagConfig = [
          ['agoricNamesAdmin', agoricNamesAdmin],
          ['bankManager', bankManager],
          ['chainWallet', () => makeChainWallet()],
          ['pegasusConnections', pegasusConnections],
          ['priceAuthorityAdmin', priceAuthorityAdmin],
          ['treasuryCreator', treasuryCreator],
          ['vattp', () => makeVattpFrom(vats)],
        ];
        await Promise.all(
          powerFlagConfig.map(async ([flag, value]) => {
            if (
              !powerFlags ||
              (!powerFlags.includes(`agoric.${flag}`) &&
                !powerFlags.includes('agoric.ALL_THE_POWERS'))
            ) {
              return;
            }
            const powerP = typeof value === 'function' ? value() : value;
            additionalPowers[flag] = await powerP;
          }),
        );

        const bundle = harden({
          ...additionalPowers,
          agoricNames,
          bank,
          chainTimerService,
          sharingService,
          faucet,
          ibcport,
          myAddressNameAdmin,
          namesByAddress,
          priceAuthority,
          board,
          zoe: zoeWUserFeePurse,
        });

        return bundle;
      },
    });
  }

  async function registerNetworkProtocols(
    vats,
    dibcBridgeManager,
    pegasus,
    pegasusConnectionsAdmin,
  ) {
    /** @type {ERef<Protocol>} */
    const network = vats.network;
    const ps = [];
    // Every vat has a loopback device.
    ps.push(
      E(vats.network).registerProtocolHandler(
        ['/local'],
        makeLoopbackProtocolHandler(),
      ),
    );
    if (dibcBridgeManager) {
      // We have access to the bridge, and therefore IBC.
      const callbacks = Far('callbacks', {
        downcall(method, obj) {
          return dibcBridgeManager.toBridge('dibc', {
            ...obj,
            type: 'IBC_METHOD',
            method,
          });
        },
      });
      const ibcHandler = await E(vats.ibc).createInstance(callbacks);
      dibcBridgeManager.register('dibc', ibcHandler);
      ps.push(
        E(vats.network).registerProtocolHandler(
          ['/ibc-port', '/ibc-hop'],
          ibcHandler,
        ),
      );
    } else {
      const loHandler = makeLoopbackProtocolHandler(
        makeNonceMaker('ibc-channel/channel-'),
      );
      ps.push(
        E(vats.network).registerProtocolHandler(['/ibc-port'], loHandler),
      );
    }
    await Promise.all(ps);

    // Add an echo listener on our ibc-port network (whether real or virtual).
    const echoPort = await E(network).bind('/ibc-port/echo');
    E(echoPort).addListener(
      Far('listener', {
        async onAccept(_port, _localAddr, _remoteAddr, _listenHandler) {
          return harden(makeEchoConnectionHandler());
        },
        async onListen(port, _listenHandler) {
          console.debug(`listening on echo port: ${port}`);
        },
      }),
    );

    if (pegasus) {
      // Add the Pegasus transfer port.
      const port = await E(network).bind('/ibc-port/transfer');
      E(port).addListener(
        Far('listener', {
          async onAccept(_port, _localAddr, _remoteAddr, _listenHandler) {
            const chandlerP = E(pegasus).makePegConnectionHandler();
            const proxyMethod = name => (...args) =>
              E(chandlerP)[name](...args);
            const onOpen = proxyMethod('onOpen');
            const onClose = proxyMethod('onClose');

            let localAddr;
            return Far('pegasusConnectionHandler', {
              onOpen(c, actualLocalAddr, ...args) {
                localAddr = actualLocalAddr;
                if (pegasusConnectionsAdmin) {
                  pegasusConnectionsAdmin.update(localAddr, c);
                }
                return onOpen(c, ...args);
              },
              onReceive: proxyMethod('onReceive'),
              onClose(c, ...args) {
                try {
                  return onClose(c, ...args);
                } finally {
                  if (pegasusConnectionsAdmin) {
                    pegasusConnectionsAdmin.delete(localAddr, c);
                  }
                }
              },
            });
          },
          async onListen(p, _listenHandler) {
            console.debug(`Listening on Pegasus transfer port: ${p}`);
          },
        }),
      );
    }

    if (dibcBridgeManager) {
      // Register a provisioning handler over the bridge.
      const handler = Far('provisioningHandler', {
        async fromBridge(_srcID, obj) {
          switch (obj.type) {
            case 'PLEASE_PROVISION': {
              const { nickname, address, powerFlags } = obj;
              return E(vats.provisioning)
                .pleaseProvision(nickname, address, powerFlags)
                .catch(e =>
                  console.error(
                    `Error provisioning ${nickname} ${address}:`,
                    e,
                  ),
                );
            }
            default:
              assert.fail(X`Unrecognized request ${obj.type}`);
          }
        },
      });
      dibcBridgeManager.register('provision', handler);
    }
  }

  // objects that live in the client's solo vat. Some services should only
  // be in the DApp environment (or only in end-user), but we're not yet
  // making a distinction, so the user also gets them.
  async function createLocalBundle(vats, devices, vatAdminSvc) {
    // This will eventually be a vat spawning service. Only needed by dev
    // environments.
    const spawner = E(vats.spawner).buildSpawner(vatAdminSvc);

    const localTimerService = E(vats.timer).createTimerService(devices.timer);

    // Needed for DApps, maybe for user clients.
    const scratch = E(vats.uploads).getUploads();

    // Only create the plugin manager if the device exists.
    let plugin;
    if (devices.plugin) {
      plugin = makePluginManager(devices.plugin, vatPowers);
    }

    // This will allow dApp developers to register in their api/deploy.js
    const httpRegCallback = Far('httpRegCallback', {
      doneLoading(subsystems) {
        return E(vats.http).doneLoading(subsystems);
      },
      send(obj, connectionHandles) {
        return E(vats.http).send(obj, connectionHandles);
      },
      registerURLHandler(handler, path) {
        return E(vats.http).registerURLHandler(handler, path);
      },
      registerAPIHandler(handler) {
        return E(vats.http).registerURLHandler(handler, '/api');
      },
      async registerWallet(wallet, privateWallet, privateWalletBridge) {
        await Promise.all([
          E(vats.http).registerURLHandler(privateWallet, '/private/wallet'),
          E(vats.http).registerURLHandler(
            privateWalletBridge,
            '/private/wallet-bridge',
          ),
          E(vats.http).setWallet(wallet),
        ]);
      },
    });

    return allComparable(
      harden({
        ...(plugin ? { plugin } : {}),
        scratch,
        spawner,
        localTimerService,
        network: vats.network,
        http: httpRegCallback,
        vattp: makeVattpFrom(vats),
      }),
    );
  }

  return Far('root', {
    async bootstrap(vats, devices) {
      const bridgeManager =
        devices.bridge && makeBridgeManager(E, D, devices.bridge);
      const {
        ROLE,
        // TODO: Don't make client bootstrap dependent on having just zero or
        // one chains.  Instead, supply all the connections as input to the
        // bootstrap (or have other ways of initializing per-connection
        // bootstrap code).  Also use an abstract name for the connection
        // instead of GCI so that a given chain can be followed across a GCI
        // change such as in a hard-fork.
        FIXME_GCI,
        giveMeAllTheAgoricPowers,
        noFakeCurrencies,
        hardcodedClientAddresses,
      } = vatParameters.argv;

      async function addRemote(addr) {
        const { transmitter, setReceiver } = await E(vats.vattp).addRemote(
          addr,
        );
        await E(vats.comms).addRemote(addr, transmitter, setReceiver);
      }

      D(devices.mailbox).registerInboundHandler(vats.vattp);
      await E(vats.vattp).registerMailboxDevice(devices.mailbox);

      const vatAdminSvc = await E(vats.vatAdmin).createVatAdminService(
        devices.vatAdmin,
      );

      console.debug(`${ROLE} bootstrap starting`);
      // scenario #1: Cloud has: multi-node chain, controller solo node,
      // provisioning server (python). New clients run provisioning
      // client (python) on localhost, which creates client solo node on
      // localhost, with HTML frontend. Multi-player mode.
      switch (ROLE) {
        // REAL VALIDATORS run this.
        case 'chain': {
          // provisioning vat can ask the demo server for bundles, and can
          // register client pubkeys with comms
          const chainBundler = await makeChainBundler(
            vats,
            bridgeManager,
            devices.timer,
            vatAdminSvc,
            noFakeCurrencies,
          );
          await E(vats.provisioning).register(
            chainBundler,
            vats.comms,
            vats.vattp,
          );
          break;
        }

        // ag-setup-solo runs this.
        case 'client': {
          let localBundle;
          let chainBundle;
          const deprecated = {};

          // Tell the http server about our presences.  This can be called in
          // any order (whether localBundle and/or chainBundle are set or not).
          const updatePresences = () =>
            E(vats.http).setPresences(localBundle, chainBundle, deprecated);

          const addLocalPresences = async () => {
            await registerNetworkProtocols(vats, bridgeManager, null);

            await setupCommandDevice(vats.http, devices.command, {
              client: true,
            });
            localBundle = await createLocalBundle(vats, devices, vatAdminSvc);

            // TODO: Remove this alias when we can.
            deprecated.uploads = localBundle.scratch;
            await updatePresences();
          };

          const addChainPresences = async () => {
            assert(FIXME_GCI, X`client must be given GCI`);
            await addRemote(FIXME_GCI);
            // addEgress(..., index, ...) is called in vat-provisioning.
            const chainProvider = E(vats.comms).addIngress(
              FIXME_GCI,
              PROVISIONER_INDEX,
            );
            chainBundle = await E(chainProvider).getChainBundle();
            await updatePresences();
          };

          // We race to add presences, regardless of order.  This allows a solo
          // REPL to be useful even if only some of the presences have loaded.
          await Promise.all([addLocalPresences(), addChainPresences()]);
          break;
        }

        // fake-chain runs this
        case 'sim-chain': {
          const chainBundler = await makeChainBundler(
            vats,
            bridgeManager,
            devices.timer,
            vatAdminSvc,
            noFakeCurrencies,
          );

          // Allow manual provisioning requests via `agoric cosmos`.
          await E(vats.provisioning).register(
            chainBundler,
            vats.comms,
            vats.vattp,
          );

          // Allow some hardcoded client address connections into the chain.
          // This is necessary for fake-chain, which does not have Cosmos SDK
          // transactions to provision its client.
          let nonce = 0;
          const chainProvider = Far('chainProvider', {
            // build a chain-side bundle for a client.
            async getChainBundle(nickname) {
              nonce += 1;
              if (giveMeAllTheAgoricPowers) {
                // NOTE: This is a special exception to the security model,
                // to give capabilities to all clients (since we are running
                // locally with the `--give-me-all-the-agoric-powers` flag).
                return chainBundler.createUserBundle(
                  nickname,
                  `agoric1admin${nonce}`,
                  ['agoric.ALL_THE_POWERS'],
                );
              }
              return chainBundler.createUserBundle(
                nickname,
                `agoric1user${nonce}`,
              );
            },
          });
          await Promise.all(
            hardcodedClientAddresses.map(async addr => {
              await addRemote(addr);
              await E(vats.comms).addEgress(
                addr,
                PROVISIONER_INDEX,
                chainProvider,
              );
            }),
          );

          break;
        }
        default:
          assert.fail(X`ROLE was not recognized: ${ROLE}`);
      }

      console.debug(`all vats initialized for ${ROLE}`);
    },
  });
}
