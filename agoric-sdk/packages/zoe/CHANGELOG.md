# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.20.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.19.1...@agoric/zoe@0.20.0) (2021-10-13)


### ⚠ BREAKING CHANGES

* add a claimsRegistrar based on attestations (#3622)

### Features

* add a claimsRegistrar based on attestations ([#3622](https://github.com/Agoric/agoric-sdk/issues/3622)) ([3acf78d](https://github.com/Agoric/agoric-sdk/commit/3acf78d786fedbc2fe02792383ebcc2cadaa8db2)), closes [#3189](https://github.com/Agoric/agoric-sdk/issues/3189) [#3473](https://github.com/Agoric/agoric-sdk/issues/3473) [#3932](https://github.com/Agoric/agoric-sdk/issues/3932)
* ContractGovernor manages parameter updating for a contract ([#3448](https://github.com/Agoric/agoric-sdk/issues/3448)) ([59ebde2](https://github.com/Agoric/agoric-sdk/commit/59ebde27708c0b3988f62a3626f9b092e148671f))


### Bug Fixes

* Increase default initial computrons for Zoe contracts for zip archive support ([01c833e](https://github.com/Agoric/agoric-sdk/commit/01c833e5a6373fdcf17088a9747b6cef8ad178bb))



### [0.19.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.19.0...@agoric/zoe@0.19.1) (2021-09-23)


### Features

* **TimerService:** add new `delay` method and protect device args ([7a2c830](https://github.com/Agoric/agoric-sdk/commit/7a2c830b6cdea1e81cc0eb8fef517704dc30a922))


### Bug Fixes

* fix bug which breaks rights conservation and offer safety guarantees ([#3858](https://github.com/Agoric/agoric-sdk/issues/3858)) ([b67bfcb](https://github.com/Agoric/agoric-sdk/commit/b67bfcb9051cdcf780aff1a10653635448b21eae))
* **timer:** remove deprecated `createRepeater` ([b45c66d](https://github.com/Agoric/agoric-sdk/commit/b45c66d6d5aadcd91bd2e50d31104bce8d4d78f6))
* skip refill meter test ([#3849](https://github.com/Agoric/agoric-sdk/issues/3849)) ([90a456f](https://github.com/Agoric/agoric-sdk/commit/90a456f78f918ad01924da4b131f5a272d03624b))



## [0.19.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.18.1...@agoric/zoe@0.19.0) (2021-09-15)


### ⚠ BREAKING CHANGES

* add required rounding modes to ratio APIs

### Features

* add required rounding modes to ratio APIs ([dc8d6dc](https://github.com/Agoric/agoric-sdk/commit/dc8d6dca5898890ef4d956c83685bc28eb189791))


### Bug Fixes

* more missing Fars. kill "this" ([#3746](https://github.com/Agoric/agoric-sdk/issues/3746)) ([7bd027a](https://github.com/Agoric/agoric-sdk/commit/7bd027a879f98a9a3f30429ee1b54e6057efec42))
* update error messages in tests. ([76d590d](https://github.com/Agoric/agoric-sdk/commit/76d590d11d6c6798f1f334c7b477b056f312a1b7))



### [0.18.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.18.0...@agoric/zoe@0.18.1) (2021-08-18)

**Note:** Version bump only for package @agoric/zoe





## [0.18.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.9...@agoric/zoe@0.18.0) (2021-08-17)


### ⚠ BREAKING CHANGES

* make the run mint within Zoe, and give only the treasury the ability to create a ZCFMint with it

* chore: change 'makeZoe' to 'makeZoeKit'

* chore: add "shutdownZoeVat" argument to Zoe, and pass it to `makeIssuerKit` for invitation issuerKit and fee issuerKit

* chore: manually lint-fix install-on-chain.js

See https://github.com/Agoric/agoric-sdk/issues/3672 for the issue to fix the root problem

### Bug Fixes

* **zoe:** relax createInvitationKit to take ERef<TimerService> ([250266b](https://github.com/Agoric/agoric-sdk/commit/250266befdff903396f507c1b13bab88b2128e18))


* BREAKING CHANGE: create the RUN Mint within Zoe (#3647) ([48762aa](https://github.com/Agoric/agoric-sdk/commit/48762aa83a30eaa0a14b2fd87777456758594262)), closes [#3647](https://github.com/Agoric/agoric-sdk/issues/3647)



### [0.17.9](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.8...@agoric/zoe@0.17.9) (2021-08-16)

**Note:** Version bump only for package @agoric/zoe





### [0.17.8](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.5...@agoric/zoe@0.17.8) (2021-08-15)


### Features

* Add private arguments to contract `start` functions, via E(zoe).startInstance ([#3576](https://github.com/Agoric/agoric-sdk/issues/3576)) ([f353e86](https://github.com/Agoric/agoric-sdk/commit/f353e86d33101365845597cb374d825fe08ff129))
* allow users to pass offerArgs with their offer ([#3578](https://github.com/Agoric/agoric-sdk/issues/3578)) ([cb1eea1](https://github.com/Agoric/agoric-sdk/commit/cb1eea1046f2de2ac90ea045eafad7c7de2afab6))


### Bug Fixes

* move the assertion that `allStagedSeatsUsed` into `reallocate` rather than `reallocateInternal` ([#3615](https://github.com/Agoric/agoric-sdk/issues/3615)) ([f8d62cc](https://github.com/Agoric/agoric-sdk/commit/f8d62cc889911f821e66a281aec5f680ed8e2628))

### 0.26.10 (2021-07-28)


### Bug Fixes

* zoe/spawner/pegasus: use unlimited Meter, not metered: true ([04d4fd9](https://github.com/Agoric/agoric-sdk/commit/04d4fd96982ecd02de50f09fa38c6e2800cca527)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **zoe:** use metered=true and xs-worker on all swingset tests ([32967ca](https://github.com/Agoric/agoric-sdk/commit/32967cad79ec72d938de8a0308dd590fbc916d2a)), closes [#3518](https://github.com/Agoric/agoric-sdk/issues/3518) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* some missing Fars ([#3498](https://github.com/Agoric/agoric-sdk/issues/3498)) ([8f77271](https://github.com/Agoric/agoric-sdk/commit/8f77271b41a4589679ad95ff907126778466aba8))



### [0.17.7](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.5...@agoric/zoe@0.17.7) (2021-08-14)


### Features

* Add private arguments to contract `start` functions, via E(zoe).startInstance ([#3576](https://github.com/Agoric/agoric-sdk/issues/3576)) ([f353e86](https://github.com/Agoric/agoric-sdk/commit/f353e86d33101365845597cb374d825fe08ff129))
* allow users to pass offerArgs with their offer ([#3578](https://github.com/Agoric/agoric-sdk/issues/3578)) ([cb1eea1](https://github.com/Agoric/agoric-sdk/commit/cb1eea1046f2de2ac90ea045eafad7c7de2afab6))


### Bug Fixes

* move the assertion that `allStagedSeatsUsed` into `reallocate` rather than `reallocateInternal` ([#3615](https://github.com/Agoric/agoric-sdk/issues/3615)) ([f8d62cc](https://github.com/Agoric/agoric-sdk/commit/f8d62cc889911f821e66a281aec5f680ed8e2628))

### 0.26.10 (2021-07-28)


### Bug Fixes

* zoe/spawner/pegasus: use unlimited Meter, not metered: true ([04d4fd9](https://github.com/Agoric/agoric-sdk/commit/04d4fd96982ecd02de50f09fa38c6e2800cca527)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **zoe:** use metered=true and xs-worker on all swingset tests ([32967ca](https://github.com/Agoric/agoric-sdk/commit/32967cad79ec72d938de8a0308dd590fbc916d2a)), closes [#3518](https://github.com/Agoric/agoric-sdk/issues/3518) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* some missing Fars ([#3498](https://github.com/Agoric/agoric-sdk/issues/3498)) ([8f77271](https://github.com/Agoric/agoric-sdk/commit/8f77271b41a4589679ad95ff907126778466aba8))



### [0.17.6](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.5...@agoric/zoe@0.17.6) (2021-07-28)


### Bug Fixes

* zoe/spawner/pegasus: use unlimited Meter, not metered: true ([04d4fd9](https://github.com/Agoric/agoric-sdk/commit/04d4fd96982ecd02de50f09fa38c6e2800cca527)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **zoe:** use metered=true and xs-worker on all swingset tests ([32967ca](https://github.com/Agoric/agoric-sdk/commit/32967cad79ec72d938de8a0308dd590fbc916d2a)), closes [#3518](https://github.com/Agoric/agoric-sdk/issues/3518) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* some missing Fars ([#3498](https://github.com/Agoric/agoric-sdk/issues/3498)) ([8f77271](https://github.com/Agoric/agoric-sdk/commit/8f77271b41a4589679ad95ff907126778466aba8))



### [0.17.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.4...@agoric/zoe@0.17.5) (2021-07-01)

**Note:** Version bump only for package @agoric/zoe





### [0.17.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.3...@agoric/zoe@0.17.4) (2021-06-28)

**Note:** Version bump only for package @agoric/zoe





### [0.17.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.2...@agoric/zoe@0.17.3) (2021-06-25)

**Note:** Version bump only for package @agoric/zoe





### [0.17.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.1...@agoric/zoe@0.17.2) (2021-06-24)

**Note:** Version bump only for package @agoric/zoe





### [0.17.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.17.0...@agoric/zoe@0.17.1) (2021-06-24)

**Note:** Version bump only for package @agoric/zoe





## [0.17.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.16.1...@agoric/zoe@0.17.0) (2021-06-23)


### ⚠ BREAKING CHANGES

* **zoe:** handle subtracting empty in a less fragile way (#3345)
* **zoe:** add method zcf.getInstance() (#3353)

### Code Refactoring

* **zoe:** add method zcf.getInstance() ([#3353](https://github.com/Agoric/agoric-sdk/issues/3353)) ([d8952c2](https://github.com/Agoric/agoric-sdk/commit/d8952c24d03ec7f2c26de9ed2a35c31c32a0a66c))
* **zoe:** handle subtracting empty in a less fragile way ([#3345](https://github.com/Agoric/agoric-sdk/issues/3345)) ([f51d327](https://github.com/Agoric/agoric-sdk/commit/f51d3270a8a59b4a5fdcac029f6f752fbad3ad59))



### [0.16.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.16.0...@agoric/zoe@0.16.1) (2021-06-16)

**Note:** Version bump only for package @agoric/zoe





## [0.16.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.7...@agoric/zoe@0.16.0) (2021-06-15)


### ⚠ BREAKING CHANGES

* **zoe:** new reallocate API to assist with reviewing conservation of rights (#3184)

### Features

* add invariant helper and constant product use example ([#3090](https://github.com/Agoric/agoric-sdk/issues/3090)) ([f533f76](https://github.com/Agoric/agoric-sdk/commit/f533f769c5ccc334a400fa57648e288f07be883c))


### Bug Fixes

* Pin ESM to forked version ([54dbb55](https://github.com/Agoric/agoric-sdk/commit/54dbb55d64d7ff7adb395bc4bd9d1461dd2d3c17))
* Preinitialize Babel ([bb76808](https://github.com/Agoric/agoric-sdk/commit/bb768089c3588e54612d7c9a4528972b5688f4e6))


### Code Refactoring

* **zoe:** new reallocate API to assist with reviewing conservation of rights ([#3184](https://github.com/Agoric/agoric-sdk/issues/3184)) ([f34e5ea](https://github.com/Agoric/agoric-sdk/commit/f34e5eae0812a9823d40d2d05ba98522c7846f2a))



## [0.15.7](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.6...@agoric/zoe@0.15.7) (2021-05-10)

**Note:** Version bump only for package @agoric/zoe





## [0.15.6](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.5...@agoric/zoe@0.15.6) (2021-05-05)

**Note:** Version bump only for package @agoric/zoe





## [0.15.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.4...@agoric/zoe@0.15.5) (2021-05-05)


### Bug Fixes

* test and workaround for a reallocate issue in zoe ([f56ff7a](https://github.com/Agoric/agoric-sdk/commit/f56ff7a76587fc36bcaf5a88efe663b3b1f974e8))
* **newSwap:** move guard out of conditional; tests pass ([dc67e67](https://github.com/Agoric/agoric-sdk/commit/dc67e67a9feb131e2509db69359e0f258fdc5367))
* update types and implementation now that Far preserves them ([a4695c4](https://github.com/Agoric/agoric-sdk/commit/a4695c43a09abc92a20c12104cfbfefb4cae2ff2))
* **ERTP:** now that {} is data, always return a displayInfo object ([fcc0cc4](https://github.com/Agoric/agoric-sdk/commit/fcc0cc4e61daef103556589fe7003da99d3c4626))
* settle REMOTE_STYLE name ([#2900](https://github.com/Agoric/agoric-sdk/issues/2900)) ([3dc6638](https://github.com/Agoric/agoric-sdk/commit/3dc66385b85cb3e8a1056b8d6e64cd3e448c041f))
* **zoe:** use fs.mkdirSync properly ([d7a8a41](https://github.com/Agoric/agoric-sdk/commit/d7a8a41310448895751ba6e67537f03b307c46bb))
* remove incorrect assertion in multipoolAutoSwap priceAuthority ([#2839](https://github.com/Agoric/agoric-sdk/issues/2839)) ([cb022d6](https://github.com/Agoric/agoric-sdk/commit/cb022d678bb1468ac06c73495e5f98b1d556cc7a)), closes [#2831](https://github.com/Agoric/agoric-sdk/issues/2831)





## [0.15.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.3...@agoric/zoe@0.15.4) (2021-04-22)

**Note:** Version bump only for package @agoric/zoe





## [0.15.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.2...@agoric/zoe@0.15.3) (2021-04-18)

**Note:** Version bump only for package @agoric/zoe





## [0.15.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.1...@agoric/zoe@0.15.2) (2021-04-16)

**Note:** Version bump only for package @agoric/zoe





## [0.15.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.15.0...@agoric/zoe@0.15.1) (2021-04-14)

**Note:** Version bump only for package @agoric/zoe





# [0.15.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.14.1...@agoric/zoe@0.15.0) (2021-04-13)


### Features

* integrate pegasus in chain bootstrap ([5c7ecba](https://github.com/Agoric/agoric-sdk/commit/5c7ecba05d0e6ec7ef9fe127ee89e0c79d3e6511))





## [0.14.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.14.0...@agoric/zoe@0.14.1) (2021-04-07)

**Note:** Version bump only for package @agoric/zoe





# [0.14.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.13.1...@agoric/zoe@0.14.0) (2021-04-06)


### Bug Fixes

* don't start the fakePriceAuthority ticker for constant prices ([90a28c9](https://github.com/Agoric/agoric-sdk/commit/90a28c9fe2fb2c6041b94b171ad32cae5a663749))
* Many more tests use ses-ava ([#2733](https://github.com/Agoric/agoric-sdk/issues/2733)) ([d1e0f0f](https://github.com/Agoric/agoric-sdk/commit/d1e0f0fef8251f014b96ca7f3975efd37e1925f8))
* price requests for zero should get zero as an answer ([#2762](https://github.com/Agoric/agoric-sdk/issues/2762)) ([11285e7](https://github.com/Agoric/agoric-sdk/commit/11285e76044fec982f6657b21fcc3da9b5d263f9)), closes [#2760](https://github.com/Agoric/agoric-sdk/issues/2760)
* properly handle empty priceList/tradeList ([a1a2075](https://github.com/Agoric/agoric-sdk/commit/a1a20753ac4d54c3e4e269021a1dbb9ef9b83e8f))
* update to depend on ses 0.12.5 ([#2718](https://github.com/Agoric/agoric-sdk/issues/2718)) ([08dbe0d](https://github.com/Agoric/agoric-sdk/commit/08dbe0db5ce06944dc92c710865e441a60b31b5b))
* update to ses 0.12.7, ses-ava 0.1.1 ([#2820](https://github.com/Agoric/agoric-sdk/issues/2820)) ([6d81775](https://github.com/Agoric/agoric-sdk/commit/6d81775715bc80e6033d75cb65edbfb1452b1608))
* use ses-ava in SwingSet where possible ([#2709](https://github.com/Agoric/agoric-sdk/issues/2709)) ([85b674e](https://github.com/Agoric/agoric-sdk/commit/85b674e7942443219fa9828841cc7bd8ef909b47))
* use SWINGSET_WORKER_TYPE to avoid WORKER_TYPE ambiguity ([c4616f1](https://github.com/Agoric/agoric-sdk/commit/c4616f1db0f2668eef5dbb97e30800d4e9caf3a0))
* **loan:** fix reallocate error in liquidation error recovery ([b50117f](https://github.com/Agoric/agoric-sdk/commit/b50117f0e300311fff24e13d66de0c92003e8ae7))


### Features

* add a method to multipoolAutoSwap to return the pool brands ([#2810](https://github.com/Agoric/agoric-sdk/issues/2810)) ([16755d0](https://github.com/Agoric/agoric-sdk/commit/16755d0b42be185b63190a832b0414fbd0b53797))
* use multipoolAutoswap as the treasury priceAuthority ([a37c795](https://github.com/Agoric/agoric-sdk/commit/a37c795a98f38ac99581d441e00177364f404bd3))





## [0.13.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.13.0...@agoric/zoe@0.13.1) (2021-03-24)


### Bug Fixes

* remove use of Data() from all packages ([540d917](https://github.com/Agoric/agoric-sdk/commit/540d917b20ae74e44752210524f6ffcb27708892)), closes [#2018](https://github.com/Agoric/agoric-sdk/issues/2018)





# [0.13.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.12.1...@agoric/zoe@0.13.0) (2021-03-16)


### Bug Fixes

* make separate 'test:xs' target, remove XS from 'test' target ([b9c1a69](https://github.com/Agoric/agoric-sdk/commit/b9c1a6987093fc8e09e8aba7acd2a1618413bac8)), closes [#2647](https://github.com/Agoric/agoric-sdk/issues/2647)
* properly type assert.typeof(xxx, 'object') ([4958636](https://github.com/Agoric/agoric-sdk/commit/49586365607175fd9f91896a66cf02ad14d93055))
* **zoe:** add Far to periodObserver ([#2577](https://github.com/Agoric/agoric-sdk/issues/2577)) ([4c07722](https://github.com/Agoric/agoric-sdk/commit/4c0772262a4f6861836cc4e472e9c18d5219ad7f)), closes [#2018](https://github.com/Agoric/agoric-sdk/issues/2018)
* **zoe:** annotate empty objects with Data or Far as appropriate ([7aaa6dc](https://github.com/Agoric/agoric-sdk/commit/7aaa6dccce257986f3e98241b670ee4cb8aae4ca)), closes [#2545](https://github.com/Agoric/agoric-sdk/issues/2545) [#2018](https://github.com/Agoric/agoric-sdk/issues/2018)
* upgrade ses to 0.12.3 to avoid console noise ([#2552](https://github.com/Agoric/agoric-sdk/issues/2552)) ([f59f5f5](https://github.com/Agoric/agoric-sdk/commit/f59f5f58d1567bb11710166b1dbc80f25c39a04f))
* weaken timer wakers to ERefs ([dda396f](https://github.com/Agoric/agoric-sdk/commit/dda396fbef9c407cf5c151ebdb783954c678ee08))


### Features

* **ava-xs:** handle some zoe tests ([#2573](https://github.com/Agoric/agoric-sdk/issues/2573)) ([7789834](https://github.com/Agoric/agoric-sdk/commit/7789834f7d232e395a707c5117295b768ed3fcff)), closes [#2503](https://github.com/Agoric/agoric-sdk/issues/2503)
* add static amountMath. Backwards compatible with old amountMath ([#2561](https://github.com/Agoric/agoric-sdk/issues/2561)) ([1620307](https://github.com/Agoric/agoric-sdk/commit/1620307ee1b45033032617cc14dfabfb338b0dc2))
* declarative environments import for SwingSet, zoe tests ([#2580](https://github.com/Agoric/agoric-sdk/issues/2580)) ([bb0e7d6](https://github.com/Agoric/agoric-sdk/commit/bb0e7d604a9d789f9df0c6863e79a039f3b2f052))





## [0.12.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.12.0...@agoric/zoe@0.12.1) (2021-02-22)

**Note:** Version bump only for package @agoric/zoe





# [0.12.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.11.0...@agoric/zoe@0.12.0) (2021-02-16)


### Bug Fixes

* add a test and correct the collateral check ([#2300](https://github.com/Agoric/agoric-sdk/issues/2300)) ([2396e4d](https://github.com/Agoric/agoric-sdk/commit/2396e4d354cdf19aa35316883377b03a44514f5e))
* Far and Remotable do unverified local marking rather than WeakMap ([#2361](https://github.com/Agoric/agoric-sdk/issues/2361)) ([ab59ab7](https://github.com/Agoric/agoric-sdk/commit/ab59ab779341b9740827b7c4cca4680e7b7212b2))
* multipoolAutoswap should throw seat.fail() when it can't comply ([#2337](https://github.com/Agoric/agoric-sdk/issues/2337)) ([0f02d52](https://github.com/Agoric/agoric-sdk/commit/0f02d52e5667d4cdaeb7c349ffa5826379335f4b)), closes [#2335](https://github.com/Agoric/agoric-sdk/issues/2335) [#2336](https://github.com/Agoric/agoric-sdk/issues/2336)
* multipoolAutoswap was calculating output prices incorrectly. ([#2166](https://github.com/Agoric/agoric-sdk/issues/2166)) ([60a4adf](https://github.com/Agoric/agoric-sdk/commit/60a4adf3976c5aeb407e479b136622b5b4793965))
* off-by-one: minimum positive result of getOutputPrice() is 1 ([#2198](https://github.com/Agoric/agoric-sdk/issues/2198)) ([82d68d9](https://github.com/Agoric/agoric-sdk/commit/82d68d91ad47453d85fdc9d023ed0e2faace184a))
* remove pointless excessive abstraction ([#2425](https://github.com/Agoric/agoric-sdk/issues/2425)) ([14285f5](https://github.com/Agoric/agoric-sdk/commit/14285f5d71dc37bbf8e90c4f26032805d39aeee6))
* review comments ([7db7e5c](https://github.com/Agoric/agoric-sdk/commit/7db7e5c4c569dfedff8d748dd58893218b0a2458))
* use assert rather than FooError constructors ([f860c5b](https://github.com/Agoric/agoric-sdk/commit/f860c5bf5add165a08cb5bd543502857c3f57998))


### Features

* add a notifier to the timerService ([#2143](https://github.com/Agoric/agoric-sdk/issues/2143)) ([3cb4606](https://github.com/Agoric/agoric-sdk/commit/3cb46063080dd4fac27507ad0062e54dbf82eda4))
* add displayInfo as a parameter to makeZcfMint. ([#2189](https://github.com/Agoric/agoric-sdk/issues/2189)) ([f5cb3b9](https://github.com/Agoric/agoric-sdk/commit/f5cb3b9f6ce44b94e9b7af6ec1677c5c7aaf73a6))
* refactor notification and subscription ([dd5f7f7](https://github.com/Agoric/agoric-sdk/commit/dd5f7f7fc5b6ae7f8bee4f123821d92a26581af4))





# [0.11.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.10.0...@agoric/zoe@0.11.0) (2020-12-10)


### Bug Fixes

* allow the priceAuthority to supply a null quotePayment ([9b038eb](https://github.com/Agoric/agoric-sdk/commit/9b038ebcf00d60fa41873d04010d5c600e8f59a7))
* minor tweaks for dapp-oracle ([b8169c1](https://github.com/Agoric/agoric-sdk/commit/b8169c1f39bc0c0d7c07099df2ac23ee7df05733))
* properly generate a quote for every timer tick ([0c18aae](https://github.com/Agoric/agoric-sdk/commit/0c18aaee67d4e1c530d632c3b69edbcca6ce8fb7))


### Features

* 2 parties can buy callSpread positions separately ([#2019](https://github.com/Agoric/agoric-sdk/issues/2019)) ([2b19988](https://github.com/Agoric/agoric-sdk/commit/2b1998804f8534db933e38f902b7b69bf3bad3cc))
* **import-bundle:** Preliminary support Endo zip hex bundle format ([#1983](https://github.com/Agoric/agoric-sdk/issues/1983)) ([983681b](https://github.com/Agoric/agoric-sdk/commit/983681bfc4bf512b6bd90806ed9220cd4fefc13c))
* implement makeQuoteNotifier(amountIn, brandOut) ([3035203](https://github.com/Agoric/agoric-sdk/commit/3035203c4d9a8972f999690976822965cc9fc6bd))





# [0.10.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.10.0-dev.0...@agoric/zoe@0.10.0) (2020-11-07)


### Bug Fixes

* add more types and update APIs ([8b1c582](https://github.com/Agoric/agoric-sdk/commit/8b1c58297665f224018110317a3768587594121a))
* allow priceRegistry to force-override an entry ([dceafd6](https://github.com/Agoric/agoric-sdk/commit/dceafd6073b8ba6d43acbefafec68797eb365729))
* be resistent to rejected wake handlers ([cde3ce2](https://github.com/Agoric/agoric-sdk/commit/cde3ce2c93ea0288a8cfa3fbbd6fefb052127f50))
* enable type checking of zoe/tools and fix errors ([98f4637](https://github.com/Agoric/agoric-sdk/commit/98f46379605817442c4c9921e6f0ecf16616976e))
* encapsulate natSafeMath.isGTE ([658c223](https://github.com/Agoric/agoric-sdk/commit/658c223963d2953efe9eba77e27eb3f51c224f4d))
* have timer.tick return a promise that awaits the wake calls ([1707ea2](https://github.com/Agoric/agoric-sdk/commit/1707ea2ec73d441fa886ebdf4ef873d2a5849f6a))
* move makeQueryInvitation back to the publicFacet ([b73733b](https://github.com/Agoric/agoric-sdk/commit/b73733bee41a77f95c101b181198733a99ce0ddb))
* put all parsing and stringification into the wallet ui ([58ff9a3](https://github.com/Agoric/agoric-sdk/commit/58ff9a32f10778e76e379d8a81cabf655c26c580))
* stop suppressing contract evaluation errors ([#1887](https://github.com/Agoric/agoric-sdk/issues/1887)) ([96cd62f](https://github.com/Agoric/agoric-sdk/commit/96cd62f6acaa7444478c24cf8856f3da643480d3))
* use only embedded timer for `quoteAtTime` to gain performance ([8aa959a](https://github.com/Agoric/agoric-sdk/commit/8aa959a43d63cb45f01b1e3a18befd95ac41447f))


### Features

* a call spread option contract and tests. ([#1854](https://github.com/Agoric/agoric-sdk/issues/1854)) ([db0962b](https://github.com/Agoric/agoric-sdk/commit/db0962b605bc28dfb186a369f0eff6c4420ff382)), closes [#1829](https://github.com/Agoric/agoric-sdk/issues/1829) [#1928](https://github.com/Agoric/agoric-sdk/issues/1928)
* add `agoric.priceAuthority` via priceAuthorityRegistry ([c602d14](https://github.com/Agoric/agoric-sdk/commit/c602d1446e7b6b37016fafd1e013da2c28cacc76))
* add ceilDivide to safeMath ([259c08f](https://github.com/Agoric/agoric-sdk/commit/259c08f6699cadf8456a4f09ebb0b8c22db49057))
* add types and flesh out manualTimer ([e01c1b0](https://github.com/Agoric/agoric-sdk/commit/e01c1b0026cac44c05d7339657fbc0e5fb0be2df))
* convert the fakePriceAuthority to a PlayerPiano model ([#1985](https://github.com/Agoric/agoric-sdk/issues/1985)) ([cd7ebd8](https://github.com/Agoric/agoric-sdk/commit/cd7ebd86b1f37655b9213786ab6828dd6c7c098a))
* export extended @agoric/zoe/tools/manualTimer ([dbfa393](https://github.com/Agoric/agoric-sdk/commit/dbfa39369d5ec14a1701571062296de63830afe7))
* move oracle and priceAggregator contracts from dapp-oracle ([035603b](https://github.com/Agoric/agoric-sdk/commit/035603bb9caa143432a77ae99b845cd80b421948))
* record displayInfo in the issuerTable ([72a2137](https://github.com/Agoric/agoric-sdk/commit/72a2137e545c1bd3f47842c1b85c6d31e2b3b6a9))
* simple volatile priceAuthority ([af76585](https://github.com/Agoric/agoric-sdk/commit/af7658576f00b6ebaae3bd91aebc6d9fc983fa71))
* **assert:** Thread stack traces to console, add entangled assert ([#1884](https://github.com/Agoric/agoric-sdk/issues/1884)) ([5d4f35f](https://github.com/Agoric/agoric-sdk/commit/5d4f35f901f2ca40a2a4d66dab980a5fe8e575f4))
* **zoe:** add priceAuthorityRegistry ([02c6147](https://github.com/Agoric/agoric-sdk/commit/02c614731477ec62c6dca18165619c8dd37ecaea))





# [0.10.0-dev.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.9.1...@agoric/zoe@0.10.0-dev.0) (2020-10-19)


### Features

* **zoe:** export src/contractFacet/fakeVatAdmin for dapps ([ea8568f](https://github.com/Agoric/agoric-sdk/commit/ea8568f7d2b67b10507d911c6585b1728ad3d011))





## [0.9.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.9.1-dev.2...@agoric/zoe@0.9.1) (2020-10-11)


### Bug Fixes

* improved error message when eventual send target is undefined ([#1847](https://github.com/Agoric/agoric-sdk/issues/1847)) ([f33d30e](https://github.com/Agoric/agoric-sdk/commit/f33d30e46eeb209f039e81a92350c06611cc45a1))
* update @agoric/store types and imports ([9e3493a](https://github.com/Agoric/agoric-sdk/commit/9e3493ad4d8c0a6a9230ad6a4c22a3254a867115))





## [0.9.1-dev.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.9.1-dev.1...@agoric/zoe@0.9.1-dev.2) (2020-09-18)

**Note:** Version bump only for package @agoric/zoe





## [0.9.1-dev.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.9.1-dev.0...@agoric/zoe@0.9.1-dev.1) (2020-09-18)

**Note:** Version bump only for package @agoric/zoe





## [0.9.1-dev.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.9.0...@agoric/zoe@0.9.1-dev.0) (2020-09-18)


### Bug Fixes

* add check so that expected values must be null in assertProposalShape ([#1788](https://github.com/Agoric/agoric-sdk/issues/1788)) ([0de4bcd](https://github.com/Agoric/agoric-sdk/commit/0de4bcdeae1858041a20ab082b6ef1c4ada39ce2))
* assert keyword in getPayout ([#1790](https://github.com/Agoric/agoric-sdk/issues/1790)) ([e4ec018](https://github.com/Agoric/agoric-sdk/commit/e4ec018683ccf64195334c2146a2b72eb0f1f8c9))
* improve error messages for mintGains and burnLosses ([#1796](https://github.com/Agoric/agoric-sdk/issues/1796)) ([916f7ae](https://github.com/Agoric/agoric-sdk/commit/916f7ae26cefbf65e667fe499b270256c49c4676))
* saveAllIssuers doc says it ignores the brand for known keywords ([88675f5](https://github.com/Agoric/agoric-sdk/commit/88675f542526671edefbbd8677981fcf02bbc8a5))
* standardize whether keywords are quoted ([1fa44d9](https://github.com/Agoric/agoric-sdk/commit/1fa44d9ff7c7f8b317df442ba7a5893a95e49f7b))





# [0.9.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.8.1...@agoric/zoe@0.9.0) (2020-09-16)


### Bug Fixes

* add a default offerHandler ([#1759](https://github.com/Agoric/agoric-sdk/issues/1759)) ([d25052d](https://github.com/Agoric/agoric-sdk/commit/d25052d10aa6e863dd68e24e0a54c46be0e0352d))
* Add a seat in mintGains() if none is provided ([0efa57f](https://github.com/Agoric/agoric-sdk/commit/0efa57f86eff3f89567c8096f185c17549ad1ac0)), closes [#1696](https://github.com/Agoric/agoric-sdk/issues/1696)
* change 'Trade Successful' offerResult to 'Order Added' ([#1651](https://github.com/Agoric/agoric-sdk/issues/1651)) ([7da7f58](https://github.com/Agoric/agoric-sdk/commit/7da7f5809166315b9283fd3954b545789050d92e))
* Deadline type parameter ([4171e05](https://github.com/Agoric/agoric-sdk/commit/4171e054351657c7156341eec067c49a037559e3))
* don't make two round trips in order to perform checks in addPool ([a6efdab](https://github.com/Agoric/agoric-sdk/commit/a6efdabdbdff8bb772dc370e4bd6e48b26b91c06))
* exit zcfSeats immediately on shutdown. ([#1770](https://github.com/Agoric/agoric-sdk/issues/1770)) ([2409eb5](https://github.com/Agoric/agoric-sdk/commit/2409eb58f0784d7ca9f7110cf37a6a8706ee541b))
* kickOut does not throw itself ([#1663](https://github.com/Agoric/agoric-sdk/issues/1663)) ([9985dc4](https://github.com/Agoric/agoric-sdk/commit/9985dc4ef6d1f1e75bb722c8abd19eefc1479e36))
* lint was unhappy with the types on an array of mixed promises ([276e5fe](https://github.com/Agoric/agoric-sdk/commit/276e5fe01ca39a8d2d3dfefe0285bd7f1dd6da96))
* make brand optional in the types of `getAmountAllocated` ([#1760](https://github.com/Agoric/agoric-sdk/issues/1760)) ([3a98491](https://github.com/Agoric/agoric-sdk/commit/3a98491b3aebe20832cb982ebd6fc18b6c77058f))
* repair and add types for multipoolAutoSwap.getLiquidityIssuer() ([7c7bcca](https://github.com/Agoric/agoric-sdk/commit/7c7bcca9b05f098b878ae7cd79c047da3c6ade8c))
* revamp multipoolAutoswap: liquidity bug, in vs. out prices ([92bfdd5](https://github.com/Agoric/agoric-sdk/commit/92bfdd5ec6b4e17500999cec825c22e7abd1758f))
* simplify helper APIs ([#1732](https://github.com/Agoric/agoric-sdk/issues/1732)) ([068f4b1](https://github.com/Agoric/agoric-sdk/commit/068f4b141c21d2fdf9958e69f35a614fa0899da5))
* stop accepting offers if zcf.shutdown is called ([#1772](https://github.com/Agoric/agoric-sdk/issues/1772)) ([6ba171f](https://github.com/Agoric/agoric-sdk/commit/6ba171fb2aec659683c911b5aa4f97dfa8e2f20a))
* userSeat.hasExited was returning the opposite of its intent ([cdfc5e6](https://github.com/Agoric/agoric-sdk/commit/cdfc5e6aff4eba8a6ec02de3486637b75a67164c)), closes [#1729](https://github.com/Agoric/agoric-sdk/issues/1729)


### Features

* add `depositToSeat`, `withdrawFromSeat` ([#1680](https://github.com/Agoric/agoric-sdk/issues/1680)) ([fdbdded](https://github.com/Agoric/agoric-sdk/commit/fdbddedb3aa41b8538533368d3bdd1fe2fa3faff))
* allow Offer to accept a PaymentPKeywordRecord ([f5f9c41](https://github.com/Agoric/agoric-sdk/commit/f5f9c41b9eec519825c3b1940e3cc743f14056c5))





## [0.8.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.8.0...@agoric/zoe@0.8.1) (2020-08-31)


### Bug Fixes

* include exported.js in files list ([bd960c3](https://github.com/Agoric/agoric-sdk/commit/bd960c3b050862e998eec7fc838f14b1a2abb437))





# [0.8.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.7.0...@agoric/zoe@0.8.0) (2020-08-31)


### Bug Fixes

* `ERef<T>` is `T | PromiseLike<T>` ([#1383](https://github.com/Agoric/agoric-sdk/issues/1383)) ([8ef4d66](https://github.com/Agoric/agoric-sdk/commit/8ef4d662dc80daf80420c0c531c2abe41517b6cd))
* add "TODO unimplemented"s ([#1580](https://github.com/Agoric/agoric-sdk/issues/1580)) ([7795f93](https://github.com/Agoric/agoric-sdk/commit/7795f9302843a2c94d4a2f42cb22affe1e91d41d))
* add shutdown() to atomicSwap, coveredCall, and sellItems. ([97dcd2e](https://github.com/Agoric/agoric-sdk/commit/97dcd2eab0a7150467c5776177f8cb879024bec9))
* add tests & fix for ZCF handling of crashes in contract code ([3cccf66](https://github.com/Agoric/agoric-sdk/commit/3cccf66cb85e91c6db10ed9530ec01f596e4cc8a))
* deduplicate redundant work ([#1550](https://github.com/Agoric/agoric-sdk/issues/1550)) ([b89651c](https://github.com/Agoric/agoric-sdk/commit/b89651c6355a058f97b4719be336a31a3ef273b4))
* deprecate getMathHelpersName for getMathHelperName ([#1409](https://github.com/Agoric/agoric-sdk/issues/1409)) ([2375b28](https://github.com/Agoric/agoric-sdk/commit/2375b28c1aadf8116c3665cec0ef0397e6a91102))
* excise @agoric/harden from the codebase ([eee6fe1](https://github.com/Agoric/agoric-sdk/commit/eee6fe1153730dec52841c9eb4c056a8c5438b0f))
* kickOut takes a `reason` error rather than a `message` string ([#1567](https://github.com/Agoric/agoric-sdk/issues/1567)) ([c3cd536](https://github.com/Agoric/agoric-sdk/commit/c3cd536f16dcf30208d88fb1c81376aa916e2a40))
* many small review comments ([#1533](https://github.com/Agoric/agoric-sdk/issues/1533)) ([ee8f782](https://github.com/Agoric/agoric-sdk/commit/ee8f782578ff4f2ea9e0ec557e14d1f52c795ca9))
* match notifier semantics to async iterables ([#1332](https://github.com/Agoric/agoric-sdk/issues/1332)) ([efbf359](https://github.com/Agoric/agoric-sdk/commit/efbf359e7f1b4ca0eb07e3ae8a12e1f061758927))
* one less unnecessary "then" ([#1623](https://github.com/Agoric/agoric-sdk/issues/1623)) ([8b22ad6](https://github.com/Agoric/agoric-sdk/commit/8b22ad6ba9f056bfe01a2daf5a02396e20c3b516))
* reduce inconsistency among our linting rules ([#1492](https://github.com/Agoric/agoric-sdk/issues/1492)) ([b6b675e](https://github.com/Agoric/agoric-sdk/commit/b6b675e2de110e2af19cad784a66220cab21dacf))
* rename produceNotifier to makeNotifierKit ([#1330](https://github.com/Agoric/agoric-sdk/issues/1330)) ([e5034f9](https://github.com/Agoric/agoric-sdk/commit/e5034f94e33e9c90c6a8fcaff70c11773e13e969))
* rename producePromise to makePromiseKit ([#1329](https://github.com/Agoric/agoric-sdk/issues/1329)) ([1d2925a](https://github.com/Agoric/agoric-sdk/commit/1d2925ad640cce7b419751027b44737bd46a6d59))
* send and receive Remotable tags ([#1628](https://github.com/Agoric/agoric-sdk/issues/1628)) ([1bae122](https://github.com/Agoric/agoric-sdk/commit/1bae1220c2c35f48f279cb3aeab6012bce8ddb5a))
* set the simpleExchange notifier's initial order book state ([70c17fd](https://github.com/Agoric/agoric-sdk/commit/70c17fdffbdf84e9999aac962300ffc23698a8ca))
* should be typed ERef ([#1611](https://github.com/Agoric/agoric-sdk/issues/1611)) ([403eba3](https://github.com/Agoric/agoric-sdk/commit/403eba3afba1853773891f62af6c039d8b9d03c4))
* tweak more types, make getVatAdmin into a function ([8c1e9d2](https://github.com/Agoric/agoric-sdk/commit/8c1e9d21fbdb7fa652100d98d5fdb13ad406f03f))
* use itemsMath.isEmpty() rather than grovelling through value ([cdc09a1](https://github.com/Agoric/agoric-sdk/commit/cdc09a1bfa4c4818c447848ceb5da8f9551c6412))
* use kickOut() rather than exit() when the offer is turned down. ([44aee5b](https://github.com/Agoric/agoric-sdk/commit/44aee5b1da64cc2c24eda3d629d051e7c57896a5))
* **zoe:** don't [@typedef](https://github.com/typedef) areRightsConserved ([281f7b1](https://github.com/Agoric/agoric-sdk/commit/281f7b1413e570b3a2f7fa9509c74f22030b3936))
* **zoe:** unify InstanceRecord usage (.instanceHandle -> .handle) ([9af7903](https://github.com/Agoric/agoric-sdk/commit/9af790322fc84a3aa1e41e957614fea2873c63b1))
* update JS typings ([20941e6](https://github.com/Agoric/agoric-sdk/commit/20941e675302ee5905e4825638e661065ad5d3f9))


### Features

* adaptors between notifiers and async iterables ([#1340](https://github.com/Agoric/agoric-sdk/issues/1340)) ([b67d21a](https://github.com/Agoric/agoric-sdk/commit/b67d21aae7e66202e3a5a3f13c7bd5769061230e))
* add getIssuerForBrand to zoe ([#1276](https://github.com/Agoric/agoric-sdk/issues/1276)) ([4fe3c83](https://github.com/Agoric/agoric-sdk/commit/4fe3c83a70000cb9f933bf6e158cc2bc1862bae9))
* add want, exit to empty seat ([#1584](https://github.com/Agoric/agoric-sdk/issues/1584)) ([ae303e1](https://github.com/Agoric/agoric-sdk/commit/ae303e1d15ee467876f708d8d91b6cd7d5d4e640))
* ERTP v0.7.0 ([#1317](https://github.com/Agoric/agoric-sdk/issues/1317)) ([2d66b5a](https://github.com/Agoric/agoric-sdk/commit/2d66b5ae1feaeef1024fc6bfac7066a385ed5207)), closes [#1306](https://github.com/Agoric/agoric-sdk/issues/1306) [#1305](https://github.com/Agoric/agoric-sdk/issues/1305)
* make production Zoe use prebundled zcf ([138ddd7](https://github.com/Agoric/agoric-sdk/commit/138ddd70cba6e1b11a4a8c0d59f15a018f8bb0e6))
* Zoe support for prebundled zcf ([60050a5](https://github.com/Agoric/agoric-sdk/commit/60050a5be51ebe47ae1365fe134a4ea222b010c0))





# [0.7.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.6.2...@agoric/zoe@0.7.0) (2020-06-30)


### Bug Fixes

* ensure keywords do not collide with numbers ([#1133](https://github.com/Agoric/agoric-sdk/issues/1133)) ([15623f3](https://github.com/Agoric/agoric-sdk/commit/15623f333928dc57fc07085f246a419f916ef4c0))
* replace openDetail with quoting q ([#1134](https://github.com/Agoric/agoric-sdk/issues/1134)) ([67808a4](https://github.com/Agoric/agoric-sdk/commit/67808a4df515630ef7dc77c59054382f626ece96))


### Features

* **zoe:** Zoe release 0.7.0 ([#1143](https://github.com/Agoric/agoric-sdk/issues/1143)) ([4a14455](https://github.com/Agoric/agoric-sdk/commit/4a14455e10f1e3807fd6633594c86a0f60026393))





## [0.6.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.6.1...@agoric/zoe@0.6.2) (2020-05-17)


### Bug Fixes

* fix typedef for makeInstance (was erroring incorrectly) and give better error message for an invalid installationHandle ([#1109](https://github.com/Agoric/agoric-sdk/issues/1109)) ([4b352fc](https://github.com/Agoric/agoric-sdk/commit/4b352fc7f399a479d82181158d4d61e63790b31f))
* fix Zoe bug in which offer safety can be violated ([#1115](https://github.com/Agoric/agoric-sdk/issues/1115)) ([39d6ae2](https://github.com/Agoric/agoric-sdk/commit/39d6ae26dd1aaec737ae0f9a47af5c396868c188)), closes [#1076](https://github.com/Agoric/agoric-sdk/issues/1076)





## [0.6.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.6.0...@agoric/zoe@0.6.1) (2020-05-10)


### Bug Fixes

* filter proposal give and want by sparseKeywords in zcf.reallocate ([#1076](https://github.com/Agoric/agoric-sdk/issues/1076)) ([fb36a40](https://github.com/Agoric/agoric-sdk/commit/fb36a406e628765376797ab3663272402d3584b3))





# [0.6.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.5.0...@agoric/zoe@0.6.0) (2020-05-04)


### Bug Fixes

* demonstrate and fix a bug with mis-spelled liquidityTokenSupply ([2161b42](https://github.com/Agoric/agoric-sdk/commit/2161b422ccb23f338d500fb60bba71a51bf3b670))
* improve handling of orders that are consummated immediately ([61e4b67](https://github.com/Agoric/agoric-sdk/commit/61e4b673014b81d8336d64059eb9a1ea46629eae)), closes [#13](https://github.com/Agoric/agoric-sdk/issues/13)
* throw if values are undefined ([7be77e5](https://github.com/Agoric/agoric-sdk/commit/7be77e5b39d70ae5d2da704ce8b5f575ec66059e))
* **assert:** slightly better assert logging ([#919](https://github.com/Agoric/agoric-sdk/issues/919)) ([47b3729](https://github.com/Agoric/agoric-sdk/commit/47b3729aa6b4ebde0d23cf791c5295fcf8f58a00))
* **zoe:** separate inviteHandle vs offerHandle ([#942](https://github.com/Agoric/agoric-sdk/issues/942)) ([1d85f97](https://github.com/Agoric/agoric-sdk/commit/1d85f97850ead03ac8e62c6e76405467914a2e84))
* use the new (typed) harden package ([2eb1af0](https://github.com/Agoric/agoric-sdk/commit/2eb1af08fe3967629a3ce165752fd501a5c85a96))
* **zoe:** Invitation to offer refactored to use upcall ([#853](https://github.com/Agoric/agoric-sdk/issues/853)) ([c142b7a](https://github.com/Agoric/agoric-sdk/commit/c142b7a64e77262927da22bde3af5793a9d39c2a))


### Features

* Add a notifier facility for Zoe and contracts ([335e009](https://github.com/Agoric/agoric-sdk/commit/335e00915bf37b2232cbcce8d15fb188bc70b0d6))
* connect notifier to wallet for SimpleExchange ([6d270f8](https://github.com/Agoric/agoric-sdk/commit/6d270f87a1788ad08526f929fc8165eaf7a61e3b))
* rename the registrar to be registry in "home" ([7603edb](https://github.com/Agoric/agoric-sdk/commit/7603edb8abed8573282337a66f6af506e8715f8c))
* SimpleExchange use notifier to announce changes to book orders ([efdd214](https://github.com/Agoric/agoric-sdk/commit/efdd214c705b099d499e039673d58f5e7584ab17))





# [0.5.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.5.0-alpha.0...@agoric/zoe@0.5.0) (2020-04-13)

**Note:** Version bump only for package @agoric/zoe





# [0.5.0-alpha.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.4.0...@agoric/zoe@0.5.0-alpha.0) (2020-04-12)


### Bug Fixes

* increase level of contract console.log to console.info ([00156f2](https://github.com/Agoric/agoric-sdk/commit/00156f235abb1b87db1c5ab0bd5155c2f3615382))
* **zoe:** ensure offers have the same instance handle as the contract calling the contract facet method ([#910](https://github.com/Agoric/agoric-sdk/issues/910)) ([0ffe65f](https://github.com/Agoric/agoric-sdk/commit/0ffe65faa5baccb114d0d91540cd9578606d7646))
* revive the ability of a zoe client to get access to the code. ([1ad9265](https://github.com/Agoric/agoric-sdk/commit/1ad926519cc6ca14aadc2a328d89f0d400a8bc95)), closes [#877](https://github.com/Agoric/agoric-sdk/issues/877)
* update checkIfProposal and rejectIfNotProposal ([7cdf09d](https://github.com/Agoric/agoric-sdk/commit/7cdf09dec9740a167c4c1d5770e82774961a5ae0))
* **zoe:** improve assertSubset error message ([#873](https://github.com/Agoric/agoric-sdk/issues/873)) ([4c6f11f](https://github.com/Agoric/agoric-sdk/commit/4c6f11f1931342fd09b3170183e3df77bed0d678))


### Features

* allow sparse keywords ([#812](https://github.com/Agoric/agoric-sdk/issues/812)) ([dcc9ba3](https://github.com/Agoric/agoric-sdk/commit/dcc9ba3413d096c78df9f8b184991c3bfd83ace3)), closes [#391](https://github.com/Agoric/agoric-sdk/issues/391)
* Check that makeInstance() returns an actual invite ([546d2ef](https://github.com/Agoric/agoric-sdk/commit/546d2ef69ca8e2c2c3ad17c0b78083b281cb3a9a)), closes [#820](https://github.com/Agoric/agoric-sdk/issues/820)





# [0.4.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.4.0-alpha.0...@agoric/zoe@0.4.0) (2020-04-02)

**Note:** Version bump only for package @agoric/zoe





# [0.4.0-alpha.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/zoe@0.3.0...@agoric/zoe@0.4.0-alpha.0) (2020-04-02)


### Features

* allow optional arguments to redeem ([e930944](https://github.com/Agoric/agoric-sdk/commit/e930944390cc85ce287a87c25005e76891fa92d1))





# 0.3.0 (2020-03-26)


### Bug Fixes

* address PR comments ([b9ed6b5](https://github.com/Agoric/agoric-sdk/commit/b9ed6b5a510433af968ba233d4e943b939defa1b))
* propagate makeContract exceptions ([9a3cc18](https://github.com/Agoric/agoric-sdk/commit/9a3cc187b7ee75c446610cc3a101dfd0f557ea66))
* reinstate console endowment needed for Zoe contract debugging ([851d1ec](https://github.com/Agoric/agoric-sdk/commit/851d1ec78bba30c70571f400c8525c654338c641))
* revert Zoe change ([#775](https://github.com/Agoric/agoric-sdk/issues/775)) ([9212818](https://github.com/Agoric/agoric-sdk/commit/9212818d71e0906a7be343eda6acd37e634008be))
* wait for payments at opportune moments ([53f359d](https://github.com/Agoric/agoric-sdk/commit/53f359d56c49ef62a90e1e834b359de8ca5dfa4f))
* **metering:** properly reset for each crank ([ba191fe](https://github.com/Agoric/agoric-sdk/commit/ba191fe3435905e3d2ea5ab016571d1943d84bec))
* **metering:** refactor names and implementation ([f1410f9](https://github.com/Agoric/agoric-sdk/commit/f1410f91fbee61903e82a81368675eef4fa0b836))


### Features

* make ERTP methods acccept promises or payments ([4b7f060](https://github.com/Agoric/agoric-sdk/commit/4b7f06048bb0f86c2028a9c9cfae8ff90b595bd7))
* **nestedEvaluate:** support new moduleFormat ([deb8ee7](https://github.com/Agoric/agoric-sdk/commit/deb8ee73437cb86ef98c160239c931305fb370ad))
* **spawner:** implement basic metering ([8bd495c](https://github.com/Agoric/agoric-sdk/commit/8bd495ce64ab20a4f7e78999846afe1f9bce96a4))
* **zoe:** implement metering of contracts ([9138801](https://github.com/Agoric/agoric-sdk/commit/91388010a4c78741f27896d21df8e610c3ff3b16))
