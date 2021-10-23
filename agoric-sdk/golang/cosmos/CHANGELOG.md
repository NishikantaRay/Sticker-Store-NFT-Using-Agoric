# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.27.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.19...@agoric/cosmos@0.27.0) (2021-10-13)


### ⚠ BREAKING CHANGES

* **cosmos:** compile agd binary to supercede ag-chain-cosmos

### Features

* **agoricd:** add new Golang binary without any SwingSet ([26c9994](https://github.com/Agoric/agoric-sdk/commit/26c99948edf4579aab124c3e74f350747e54b840))
* **agoricd:** have `agoricd start` delegate to `ag-chain-cosmos` ([1740795](https://github.com/Agoric/agoric-sdk/commit/174079552e1557dd13318d35435d401dfd51e05f))
* **cosmos:** compile agd binary to supercede ag-chain-cosmos ([6880646](https://github.com/Agoric/agoric-sdk/commit/6880646e6c26a2df2c2c6b95ac2ac5e230f41e76))
* revise x/lien to hold total liened amount ([842c9b0](https://github.com/Agoric/agoric-sdk/commit/842c9b0d98a8655b286c9f91c70bb6fddc3e0ba3))
* stateless lien module that upcalls to kernel ([603c0cf](https://github.com/Agoric/agoric-sdk/commit/603c0cfc8d2b4706dbbaa42d2ae057fa9dea65dc))


### Bug Fixes

* address review comments ([8af3e15](https://github.com/Agoric/agoric-sdk/commit/8af3e1547b4df32c604f6b628a62bff230666166))
* bugfixes, comments ([30dbeaa](https://github.com/Agoric/agoric-sdk/commit/30dbeaa7ef64f2c2dee9ddeb0a8c3929a611c21e))
* don't use manual key prefix ([50a881b](https://github.com/Agoric/agoric-sdk/commit/50a881be4971cd5c006867daca66eb6138276492))
* lien accounts must proxy all account methods ([db79c42](https://github.com/Agoric/agoric-sdk/commit/db79c42398195a09e8b3953dad35224f0943752b))



### [0.26.19](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.18...@agoric/cosmos@0.26.19) (2021-09-23)

**Note:** Version bump only for package @agoric/cosmos





### [0.26.18](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.17...@agoric/cosmos@0.26.18) (2021-09-15)


### Features

* **cosmos:** publish event when `x/swingset` storage is modified ([8b63eb0](https://github.com/Agoric/agoric-sdk/commit/8b63eb08006807af547f4b1e166fef34c6cdde75))


### Bug Fixes

* **cosmos:** ensure simulated transactions can't trigger SwingSet ([997329a](https://github.com/Agoric/agoric-sdk/commit/997329a92f5380edab586f4186a2092ce361dcde))
* **cosmos:** the bootstrap block is not a simulation, either ([f906a54](https://github.com/Agoric/agoric-sdk/commit/f906a54a9a3cdb2342c8b274a7132fb6aa9e9fcc))
* **solo:** query WebSocket for mailbox instead of ag-cosmos-helper ([9a23c34](https://github.com/Agoric/agoric-sdk/commit/9a23c344e3d2c1980e27db23e3caa306a9bd655f))



### [0.26.17](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.16...@agoric/cosmos@0.26.17) (2021-08-21)


### Bug Fixes

* **cosmos:** the bootstrap block is not a simulation, either ([c4e4727](https://github.com/Agoric/agoric-sdk/commit/c4e472748b4eed4f7ad9650a5904a526e0c2e214))



### [0.26.16](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.15...@agoric/cosmos@0.26.16) (2021-08-21)

**Note:** Version bump only for package @agoric/cosmos





### [0.26.15](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.14...@agoric/cosmos@0.26.15) (2021-08-18)


### Bug Fixes

* **cosmos:** don't version x/swingset proto yet ([4463e89](https://github.com/Agoric/agoric-sdk/commit/4463e8950f930216ec0a1270e3c5d3a8d6ec510d))
* **cosmos:** properly fail when querying missing egress/mailbox ([0c1be92](https://github.com/Agoric/agoric-sdk/commit/0c1be922f3742ea2e7fb7e82f567ab04b85f7ae1))
* **cosmos:** route x/swingset queries through GRPC ([34fc9cd](https://github.com/Agoric/agoric-sdk/commit/34fc9cd89ef1c018840ed019c481a1e255d96378))



### [0.26.14](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.13...@agoric/cosmos@0.26.14) (2021-08-17)

**Note:** Version bump only for package @agoric/cosmos





### [0.26.13](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.12...@agoric/cosmos@0.26.13) (2021-08-16)

**Note:** Version bump only for package @agoric/cosmos





### [0.26.12](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.9...@agoric/cosmos@0.26.12) (2021-08-15)


### Features

* **cosmos:** generate GRPC REST gateway implementations ([968b78e](https://github.com/Agoric/agoric-sdk/commit/968b78e40bd8a2bdb9aff1f141c1d9489b581354))
* **cosmos:** upgrade to v0.43.0 and add vbank governance hooks ([29137dd](https://github.com/Agoric/agoric-sdk/commit/29137dd8bd8b08776fff7a2a97405042da9222a5))
* **vbank:** add governance and query methods ([c80912e](https://github.com/Agoric/agoric-sdk/commit/c80912e6110b8d45d6b040ee9f3d9c1addaab804))


### Bug Fixes

* **cosmos:** deterministic storage modification and querying ([799ebdb](https://github.com/Agoric/agoric-sdk/commit/799ebdb77056ce40404358099a65f8ef673de6c9))
* **cosmos:** don't force the output format to JSON ([671b93d](https://github.com/Agoric/agoric-sdk/commit/671b93d6032656dceeee1616b849535145b3e10d))

### 0.26.10 (2021-07-28)


### Features

* **cosmos:** use agoric-labs/cosmos-sdk v0.43.0-rc0.agoric ([6dfebdb](https://github.com/Agoric/agoric-sdk/commit/6dfebdb1493ae448f226cd5b1be399213068ca95))


### Bug Fixes

* **cosmic-swingset:** use BOOTSTRAP_BLOCK to avoid slog confusion ([9c8725b](https://github.com/Agoric/agoric-sdk/commit/9c8725bae6ff4038052f33947da77d3eddc0351d))



### [0.26.11](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.9...@agoric/cosmos@0.26.11) (2021-08-14)


### Features

* **cosmos:** generate GRPC REST gateway implementations ([968b78e](https://github.com/Agoric/agoric-sdk/commit/968b78e40bd8a2bdb9aff1f141c1d9489b581354))
* **cosmos:** upgrade to v0.43.0 and add vbank governance hooks ([29137dd](https://github.com/Agoric/agoric-sdk/commit/29137dd8bd8b08776fff7a2a97405042da9222a5))
* **vbank:** add governance and query methods ([c80912e](https://github.com/Agoric/agoric-sdk/commit/c80912e6110b8d45d6b040ee9f3d9c1addaab804))


### Bug Fixes

* **cosmos:** don't force the output format to JSON ([671b93d](https://github.com/Agoric/agoric-sdk/commit/671b93d6032656dceeee1616b849535145b3e10d))

### 0.26.10 (2021-07-28)


### Features

* **cosmos:** use agoric-labs/cosmos-sdk v0.43.0-rc0.agoric ([6dfebdb](https://github.com/Agoric/agoric-sdk/commit/6dfebdb1493ae448f226cd5b1be399213068ca95))


### Bug Fixes

* **cosmic-swingset:** use BOOTSTRAP_BLOCK to avoid slog confusion ([9c8725b](https://github.com/Agoric/agoric-sdk/commit/9c8725bae6ff4038052f33947da77d3eddc0351d))



### [0.26.10](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.9...@agoric/cosmos@0.26.10) (2021-07-28)


### Features

* **cosmos:** use agoric-labs/cosmos-sdk v0.43.0-rc0.agoric ([6dfebdb](https://github.com/Agoric/agoric-sdk/commit/6dfebdb1493ae448f226cd5b1be399213068ca95))


### Bug Fixes

* **cosmic-swingset:** use BOOTSTRAP_BLOCK to avoid slog confusion ([9c8725b](https://github.com/Agoric/agoric-sdk/commit/9c8725bae6ff4038052f33947da77d3eddc0351d))



### [0.26.9](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.8...@agoric/cosmos@0.26.9) (2021-07-01)


### Bug Fixes

* **vbank:** ensure that multiple balance updates are sorted ([204790f](https://github.com/Agoric/agoric-sdk/commit/204790f4c70e198cc06fe54e9205a71567ca6c83))



### [0.26.8](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.7...@agoric/cosmos@0.26.8) (2021-06-28)


### Bug Fixes

* **vbank:** be sure to persist nonce state in the KVStore ([9dc151a](https://github.com/Agoric/agoric-sdk/commit/9dc151a26c13c84351dba237d2e550f0cabb3d49))



### [0.26.7](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.6...@agoric/cosmos@0.26.7) (2021-06-25)


### Bug Fixes

* **cosmos:** have daemon also trap os.Interrupt for good luck ([9854446](https://github.com/Agoric/agoric-sdk/commit/98544462b469cce8b3365223fc31a4ca305e610f))



### [0.26.6](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.5...@agoric/cosmos@0.26.6) (2021-06-24)

**Note:** Version bump only for package @agoric/cosmos





### [0.26.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.4...@agoric/cosmos@0.26.5) (2021-06-23)


### Bug Fixes

* move COMMIT_BLOCK immediately before the Cosmos SDK commit ([f0d2e68](https://github.com/Agoric/agoric-sdk/commit/f0d2e686a68cffbee2e97697594a7669051f0b40))



### [0.26.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.3...@agoric/cosmos@0.26.4) (2021-06-16)

**Note:** Version bump only for package @agoric/cosmos





### [0.26.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.2...@agoric/cosmos@0.26.3) (2021-06-15)


### Features

* enable VPURSE_GIVE_TO_FEE_COLLECTOR ([b56fa7f](https://github.com/Agoric/agoric-sdk/commit/b56fa7fc6c7180e3bcba3660da3ec897bc84d551))
* epoched reward distribution part 1 - buffer ([e6bbb6d](https://github.com/Agoric/agoric-sdk/commit/e6bbb6d9dcdc2f35c3fe324538455780253f5d38))
* epoched reward distribution part 2 - send ([331793b](https://github.com/Agoric/agoric-sdk/commit/331793b982062514b3a6c98d214f8a63ed6bcd7c))
* implement cosmos-sdk v0.43.0-beta1 ([7b05073](https://github.com/Agoric/agoric-sdk/commit/7b05073f1e8a458e54fa9ddd6ba037b9e472d59a))
* send AG_COSMOS_INIT supplyCoins instead of vpurse genesis ([759d6ab](https://github.com/Agoric/agoric-sdk/commit/759d6abe4ec5f798dca15a88d3523c63808a8b30))


### Bug Fixes

* apply recent renames, use aliases if possible ([d703223](https://github.com/Agoric/agoric-sdk/commit/d7032237fea884b28c72cb3bdbd6bc9deebf6d46))
* don't intercept SIGQUIT ([223185a](https://github.com/Agoric/agoric-sdk/commit/223185a3acf76f6577119b110f1d005d686b7187))
* handle amounts over int64 limits ([fabfacb](https://github.com/Agoric/agoric-sdk/commit/fabfacb326adf0bfc00fd4de66e33ad100a94606))
* quoting typo ([afb1c98](https://github.com/Agoric/agoric-sdk/commit/afb1c98cebaed03296b5112523518c0f6618f3e7))
* there is no "controller" port; we meant "storage" ([299baa7](https://github.com/Agoric/agoric-sdk/commit/299baa7ba66581483bdf8f0ac39ecbf2f53b411a))
* **golang:** exit Go on signals; no more SIGKILL just to quit ([b5222b3](https://github.com/Agoric/agoric-sdk/commit/b5222b3352ad71854472dce9f8561417576ddd97))
* Pin ESM to forked version ([54dbb55](https://github.com/Agoric/agoric-sdk/commit/54dbb55d64d7ff7adb395bc4bd9d1461dd2d3c17))



## [0.26.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.1...@agoric/cosmos@0.26.2) (2021-05-10)


### Bug Fixes

* a malformed case statement elided recipient vpurse updates ([5f4664d](https://github.com/Agoric/agoric-sdk/commit/5f4664de429740a266bbbd0ad6b1f868a2b4240b))
* update incorrect string cast where Sprint was needed ([c83dc19](https://github.com/Agoric/agoric-sdk/commit/c83dc198a23c844edaccacf351bb8911c893153b))





## [0.26.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.26.0...@agoric/cosmos@0.26.1) (2021-05-05)

**Note:** Version bump only for package @agoric/cosmos





# [0.26.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.25.4...@agoric/cosmos@0.26.0) (2021-05-05)


### Bug Fixes

* adjust git-revision.txt generation ([6a8b0f2](https://github.com/Agoric/agoric-sdk/commit/6a8b0f20df17d5427b1c70273bcc170c7945dc2a))


### Features

* **golang:** implement balance updates for virtual purses ([c4c485c](https://github.com/Agoric/agoric-sdk/commit/c4c485cbc2280464e632b1b4a2fa945e86ff8b36))
* donate RUN from the bootstrap payment on each provision ([43c5db5](https://github.com/Agoric/agoric-sdk/commit/43c5db5d819a3be059a5ead074aa96c3d87416c4))
* plumb through the genesis data to vpurse initialisation ([8105589](https://github.com/Agoric/agoric-sdk/commit/8105589dd7e14a7e8edbbac4a794d8eee2f30298))
* **vpurse:** connect to golang ([d2f719d](https://github.com/Agoric/agoric-sdk/commit/d2f719dce9936a129817a3781bc1de8c4367bb46))





## [0.25.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.25.3...@agoric/cosmos@0.25.4) (2021-04-22)

**Note:** Version bump only for package @agoric/cosmos





## [0.25.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.25.2...@agoric/cosmos@0.25.3) (2021-04-18)

**Note:** Version bump only for package @agoric/cosmos





## [0.25.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.25.1...@agoric/cosmos@0.25.2) (2021-04-16)

**Note:** Version bump only for package @agoric/cosmos





## [0.25.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.25.0...@agoric/cosmos@0.25.1) (2021-04-14)

**Note:** Version bump only for package @agoric/cosmos





# [0.25.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.24.5...@agoric/cosmos@0.25.0) (2021-04-13)


### Bug Fixes

* run swingset on genesis init before opening for business ([7e228d4](https://github.com/Agoric/agoric-sdk/commit/7e228d40d8d435727863c72c1ba19ca7267476ce))


### Features

* install Pegasus on "transfer" IBC port ([a257216](https://github.com/Agoric/agoric-sdk/commit/a2572163878bad9c6ba11914e02b8aacfefedeba))
* wait until genesis time has passed before continuing ([4d13843](https://github.com/Agoric/agoric-sdk/commit/4d13843db58fa1f7037386d54db13cbf786cd1d3))





## [0.24.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.24.4...@agoric/cosmos@0.24.5) (2021-04-07)

**Note:** Version bump only for package @agoric/cosmos





## [0.24.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.24.3...@agoric/cosmos@0.24.4) (2021-04-06)

**Note:** Version bump only for package @agoric/cosmos





## [0.24.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.24.2...@agoric/cosmos@0.24.3) (2021-03-24)


### Bug Fixes

* silence some noisy Go logs ([6ef8a69](https://github.com/Agoric/agoric-sdk/commit/6ef8a69b5c7845a33d1ec7bfeb6c74ece2fbab0f))





## [0.24.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.24.1...@agoric/cosmos@0.24.2) (2021-03-16)


### Bug Fixes

* golang/cosmos upgrades ([d18e9d3](https://github.com/Agoric/agoric-sdk/commit/d18e9d31de456b2c44a08f36e01bd4b6c2c237dc))
* make separate 'test:xs' target, remove XS from 'test' target ([b9c1a69](https://github.com/Agoric/agoric-sdk/commit/b9c1a6987093fc8e09e8aba7acd2a1618413bac8)), closes [#2647](https://github.com/Agoric/agoric-sdk/issues/2647)





## [0.24.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/cosmos@0.24.0...@agoric/cosmos@0.24.1) (2021-02-22)

**Note:** Version bump only for package @agoric/cosmos
