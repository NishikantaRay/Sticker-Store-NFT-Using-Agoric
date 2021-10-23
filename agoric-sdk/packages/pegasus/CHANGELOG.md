# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [0.4.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.4.4...@agoric/pegasus@0.4.5) (2021-10-13)

**Note:** Version bump only for package @agoric/pegasus





### [0.4.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.4.3...@agoric/pegasus@0.4.4) (2021-09-23)

**Note:** Version bump only for package @agoric/pegasus





### [0.4.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.4.2...@agoric/pegasus@0.4.3) (2021-09-15)


### Bug Fixes

* more missing Fars. kill "this" ([#3746](https://github.com/Agoric/agoric-sdk/issues/3746)) ([7bd027a](https://github.com/Agoric/agoric-sdk/commit/7bd027a879f98a9a3f30429ee1b54e6057efec42))



### [0.4.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.4.1...@agoric/pegasus@0.4.2) (2021-08-21)

**Note:** Version bump only for package @agoric/pegasus





### [0.4.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.4.0...@agoric/pegasus@0.4.1) (2021-08-18)

**Note:** Version bump only for package @agoric/pegasus





## [0.4.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.12...@agoric/pegasus@0.4.0) (2021-08-17)


### ⚠ BREAKING CHANGES

* make the run mint within Zoe, and give only the treasury the ability to create a ZCFMint with it

* chore: change 'makeZoe' to 'makeZoeKit'

* chore: add "shutdownZoeVat" argument to Zoe, and pass it to `makeIssuerKit` for invitation issuerKit and fee issuerKit

* chore: manually lint-fix install-on-chain.js

See https://github.com/Agoric/agoric-sdk/issues/3672 for the issue to fix the root problem

* BREAKING CHANGE: create the RUN Mint within Zoe (#3647) ([48762aa](https://github.com/Agoric/agoric-sdk/commit/48762aa83a30eaa0a14b2fd87777456758594262)), closes [#3647](https://github.com/Agoric/agoric-sdk/issues/3647)



### [0.3.12](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.11...@agoric/pegasus@0.3.12) (2021-08-16)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.11](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.8...@agoric/pegasus@0.3.11) (2021-08-15)

### 0.26.10 (2021-07-28)


### Bug Fixes

* zoe/spawner/pegasus: use unlimited Meter, not metered: true ([04d4fd9](https://github.com/Agoric/agoric-sdk/commit/04d4fd96982ecd02de50f09fa38c6e2800cca527)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)



### [0.3.10](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.8...@agoric/pegasus@0.3.10) (2021-08-14)

### 0.26.10 (2021-07-28)


### Bug Fixes

* zoe/spawner/pegasus: use unlimited Meter, not metered: true ([04d4fd9](https://github.com/Agoric/agoric-sdk/commit/04d4fd96982ecd02de50f09fa38c6e2800cca527)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)



### [0.3.9](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.8...@agoric/pegasus@0.3.9) (2021-07-28)


### Bug Fixes

* zoe/spawner/pegasus: use unlimited Meter, not metered: true ([04d4fd9](https://github.com/Agoric/agoric-sdk/commit/04d4fd96982ecd02de50f09fa38c6e2800cca527)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)



### [0.3.8](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.7...@agoric/pegasus@0.3.8) (2021-07-01)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.7](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.6...@agoric/pegasus@0.3.7) (2021-07-01)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.6](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.5...@agoric/pegasus@0.3.6) (2021-06-28)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.4...@agoric/pegasus@0.3.5) (2021-06-25)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.3...@agoric/pegasus@0.3.4) (2021-06-24)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.2...@agoric/pegasus@0.3.3) (2021-06-24)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.1...@agoric/pegasus@0.3.2) (2021-06-23)

**Note:** Version bump only for package @agoric/pegasus





### [0.3.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.3.0...@agoric/pegasus@0.3.1) (2021-06-16)

**Note:** Version bump only for package @agoric/pegasus





## [0.3.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.7...@agoric/pegasus@0.3.0) (2021-06-15)


### ⚠ BREAKING CHANGES

* **zoe:** new reallocate API to assist with reviewing conservation of rights (#3184)

### Bug Fixes

* Pin ESM to forked version ([54dbb55](https://github.com/Agoric/agoric-sdk/commit/54dbb55d64d7ff7adb395bc4bd9d1461dd2d3c17))


### Code Refactoring

* **zoe:** new reallocate API to assist with reviewing conservation of rights ([#3184](https://github.com/Agoric/agoric-sdk/issues/3184)) ([f34e5ea](https://github.com/Agoric/agoric-sdk/commit/f34e5eae0812a9823d40d2d05ba98522c7846f2a))



## [0.2.7](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.6...@agoric/pegasus@0.2.7) (2021-05-10)

**Note:** Version bump only for package @agoric/pegasus





## [0.2.6](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.5...@agoric/pegasus@0.2.6) (2021-05-05)

**Note:** Version bump only for package @agoric/pegasus





## [0.2.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.4...@agoric/pegasus@0.2.5) (2021-05-05)


### Bug Fixes

* **pegasus:** update to new solo package ([cf91a04](https://github.com/Agoric/agoric-sdk/commit/cf91a04fa6ce53dc06de0ccb8c8173050134575a))





## [0.2.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.3...@agoric/pegasus@0.2.4) (2021-04-22)


### Bug Fixes

* rename cosmos-level tokens uagstake/uag to ubld/urun ([0557983](https://github.com/Agoric/agoric-sdk/commit/0557983210571c9c2ba801d68644d71641a3f790))





## [0.2.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.2...@agoric/pegasus@0.2.3) (2021-04-18)

**Note:** Version bump only for package @agoric/pegasus





## [0.2.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.1...@agoric/pegasus@0.2.2) (2021-04-16)

**Note:** Version bump only for package @agoric/pegasus





## [0.2.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/pegasus@0.2.0...@agoric/pegasus@0.2.1) (2021-04-14)

**Note:** Version bump only for package @agoric/pegasus





# 0.2.0 (2021-04-13)


### Bug Fixes

* adjust Pegasus to actually work correctly with pegRemote ([8cd8c72](https://github.com/Agoric/agoric-sdk/commit/8cd8c72bc5fa207471ac2fdd9ac750dbdda7c39f))


### Features

* install Pegasus on chain bootstrap ([7615292](https://github.com/Agoric/agoric-sdk/commit/76152926942f9c0610ab3d08a45c464856779643))
* integrate pegasus in chain bootstrap ([5c7ecba](https://github.com/Agoric/agoric-sdk/commit/5c7ecba05d0e6ec7ef9fe127ee89e0c79d3e6511))
* move Pegasus contract to SDK ([d0ca2cc](https://github.com/Agoric/agoric-sdk/commit/d0ca2cc155953c63eef5f56f236fa9280984730a))
