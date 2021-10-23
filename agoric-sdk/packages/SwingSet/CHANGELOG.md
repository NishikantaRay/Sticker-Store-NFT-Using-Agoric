# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.23.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.22.1...@agoric/swingset-vat@0.23.0) (2021-10-13)


### ⚠ BREAKING CHANGES

* **xsnap:** upgrade XS to fix memory leak

### Features

* Thread URL and Base64 endowments ([b52269d](https://github.com/Agoric/agoric-sdk/commit/b52269d58be665baf45bbb38ace57ca741e5ae4c))


### Bug Fixes

* adapt timers to async iterables ([#3949](https://github.com/Agoric/agoric-sdk/issues/3949)) ([9739127](https://github.com/Agoric/agoric-sdk/commit/9739127262e9fac48757094a4d2d9f3f35f4bfc5))
* **SwingSet:** Adjust SES change detectors ([3efb36e](https://github.com/Agoric/agoric-sdk/commit/3efb36eb48521aeb9479f27bd691be485ecda234))
* **xsnap:** upgrade XS to fix memory leak ([9a70831](https://github.com/Agoric/agoric-sdk/commit/9a70831cbc02edea7721b9a521492c030b097f2c)), closes [#3839](https://github.com/Agoric/agoric-sdk/issues/3839) [#3877](https://github.com/Agoric/agoric-sdk/issues/3877) [#3889](https://github.com/Agoric/agoric-sdk/issues/3889)



### [0.22.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.22.0...@agoric/swingset-vat@0.22.1) (2021-09-23)


### Features

* **TimerService:** add new `delay` method and protect device args ([7a2c830](https://github.com/Agoric/agoric-sdk/commit/7a2c830b6cdea1e81cc0eb8fef517704dc30a922))


### Bug Fixes

* **solo:** make `localTimerService` in ms, and update correctly ([d6d4724](https://github.com/Agoric/agoric-sdk/commit/d6d472445a05b8c3d83fc9621879c3c91bf4d737))
* **swingset:** DummySlogger needs to be more realistic ([d8d146d](https://github.com/Agoric/agoric-sdk/commit/d8d146de69a08d2b6582b3a778a7f44985450fc0))
* **swingset:** have slogger record replay status for syscalls too ([722f903](https://github.com/Agoric/agoric-sdk/commit/722f903c8306f4245addad6bbe9df7b8b7a7321b))
* **swingset:** make vat-warehouse responsible for slogging deliveries ([e317589](https://github.com/Agoric/agoric-sdk/commit/e31758914c165113c4ba6a4574a73ee888addad1))
* **SwingSet:** improve slogging during replay ([d6e64da](https://github.com/Agoric/agoric-sdk/commit/d6e64daf4d8240ad51eafb917e6f4590c8caebfb)), closes [#3428](https://github.com/Agoric/agoric-sdk/issues/3428)
* **timer:** remove deprecated `createRepeater` ([b45c66d](https://github.com/Agoric/agoric-sdk/commit/b45c66d6d5aadcd91bd2e50d31104bce8d4d78f6))
* **xsnap:** format objects nicely in console using SES assert.quote ([#3856](https://github.com/Agoric/agoric-sdk/issues/3856)) ([a3306d0](https://github.com/Agoric/agoric-sdk/commit/a3306d01d8e87c4bc7483a61e42cc30b006feb81)), closes [#3844](https://github.com/Agoric/agoric-sdk/issues/3844)



## [0.22.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.21.3...@agoric/swingset-vat@0.22.0) (2021-09-15)


### ⚠ BREAKING CHANGES

* clean up organization of swing-store

### Features

* **swingset-vat:** Thread dev dependencies explicitly ([f55982f](https://github.com/Agoric/agoric-sdk/commit/f55982fccf211fba9625cd8015b5c06e9644ee60))
* **swingset-vat:** Thread module format through loadBasedir, swingset config ([b243889](https://github.com/Agoric/agoric-sdk/commit/b243889d2f5e7c3c279373943b593cf9773c6366))
* **xsnap:** integrate native TextEncoder / TextDecoder ([9d65dbe](https://github.com/Agoric/agoric-sdk/commit/9d65dbe2410e1856c3ac1fa6ff7eb921bb24ec0c))


### Bug Fixes

* more missing Fars. kill "this" ([#3746](https://github.com/Agoric/agoric-sdk/issues/3746)) ([7bd027a](https://github.com/Agoric/agoric-sdk/commit/7bd027a879f98a9a3f30429ee1b54e6057efec42))
* XS + SES snapshots are deterministic (test) ([#3781](https://github.com/Agoric/agoric-sdk/issues/3781)) ([95c5f01](https://github.com/Agoric/agoric-sdk/commit/95c5f014b2808ef1b3a32302bb37b3894e449abe)), closes [#2776](https://github.com/Agoric/agoric-sdk/issues/2776)


### Code Refactoring

* clean up organization of swing-store ([3c7e57b](https://github.com/Agoric/agoric-sdk/commit/3c7e57b8f62c0b93660dd57c002ffb96c2cd4137))



### [0.21.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.21.2...@agoric/swingset-vat@0.21.3) (2021-08-18)


### Bug Fixes

* **swingset:** commit crank-buffer after every c.step/c.run ([90c2b85](https://github.com/Agoric/agoric-sdk/commit/90c2b856228b926c40440172bc911568b8c1e0c5)), closes [#720](https://github.com/Agoric/agoric-sdk/issues/720) [#3720](https://github.com/Agoric/agoric-sdk/issues/3720)
* **swingset:** comms initialization check must be deterministic ([683b771](https://github.com/Agoric/agoric-sdk/commit/683b77108dbb6afaf6b2557dfacae2298016eaca)), closes [#2910](https://github.com/Agoric/agoric-sdk/issues/2910) [#3726](https://github.com/Agoric/agoric-sdk/issues/3726)
* **swingset:** make test-controller less sensitive to source changes ([c07ad3a](https://github.com/Agoric/agoric-sdk/commit/c07ad3af053210cc157c0766f201dd787237f79e)), closes [#3718](https://github.com/Agoric/agoric-sdk/issues/3718)
* **swingset:** record cranks and crankhash/activityhash in slog ([8bc08de](https://github.com/Agoric/agoric-sdk/commit/8bc08de37da922803bf880303729b68c098590ae)), closes [#3720](https://github.com/Agoric/agoric-sdk/issues/3720)



### [0.21.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.21.1...@agoric/swingset-vat@0.21.2) (2021-08-17)


### Bug Fixes

* Remove dregs of node -r esm ([#3710](https://github.com/Agoric/agoric-sdk/issues/3710)) ([e30c934](https://github.com/Agoric/agoric-sdk/commit/e30c934a9de19e930677c7b65ad98abe0be16d56))
* Remove superfluous -S for env in shebangs ([0b897ab](https://github.com/Agoric/agoric-sdk/commit/0b897ab04941ce1b690459e3386fd2c02d860f45))



### [0.21.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.21.0...@agoric/swingset-vat@0.21.1) (2021-08-16)


### Bug Fixes

* remove more instances of `.cjs` files ([0f61d9b](https://github.com/Agoric/agoric-sdk/commit/0f61d9bff763aeb21c7b61010040ca5e7bd964eb))



## [0.21.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.6...@agoric/swingset-vat@0.21.0) (2021-08-15)


### ⚠ BREAKING CHANGES

* **swingset:** Convert plugin API to NESM
* **swingset:** Convert RESM to NESM

### Features

* **swingset:** add "run policy" object to controller.run() ([420edda](https://github.com/Agoric/agoric-sdk/commit/420edda2f8dd668cf84acc1b7cd0929bcbd79623)), closes [#3460](https://github.com/Agoric/agoric-sdk/issues/3460)
* **swingset:** hash kernel state changes into 'activityhash' ([47ec86b](https://github.com/Agoric/agoric-sdk/commit/47ec86be063f9021c91018dbc1f0952be543f0c7)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442)
* require that buildRootObject always returns a Far reference ([0cda623](https://github.com/Agoric/agoric-sdk/commit/0cda6230210add2bbedc40100dbfe8f0f8e98826))


### Bug Fixes

* **swingset:** define 'meterControl' to disable metering ([bdf8c08](https://github.com/Agoric/agoric-sdk/commit/bdf8c08ec2643217f507968bc9ae36fa548a8f69)), closes [#3458](https://github.com/Agoric/agoric-sdk/issues/3458)
* **swingset:** delete unused snapshots ([#3505](https://github.com/Agoric/agoric-sdk/issues/3505)) ([317959d](https://github.com/Agoric/agoric-sdk/commit/317959d77ca669c8e4bbf504d89fe55bdd383253)), closes [#3374](https://github.com/Agoric/agoric-sdk/issues/3374) [#3431](https://github.com/Agoric/agoric-sdk/issues/3431)
* **swingset:** Finish vat tool RESM to NESM conversion ([b6e943b](https://github.com/Agoric/agoric-sdk/commit/b6e943b6573bd75e408987a55a597198ec2ac00d))
* **swingset:** liveslots: disable metering of GC-sensitive calls ([a11a477](https://github.com/Agoric/agoric-sdk/commit/a11a477d867ab83415db9aff666f6d91f9ed6bd9)), closes [#3458](https://github.com/Agoric/agoric-sdk/issues/3458)
* **swingset:** move "kernelStats" into local/non-hashed DB space ([df8359e](https://github.com/Agoric/agoric-sdk/commit/df8359eca80e28736d294a558ed6c5e3b8b14127)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442)
* **swingset:** rename snapshot-related DB keys to be "local" ([e79e43c](https://github.com/Agoric/agoric-sdk/commit/e79e43c2776161b3f872a130131ad4a7b4c16e3f)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442)
* **swingset:** Support NESM importers ([fac9b1a](https://github.com/Agoric/agoric-sdk/commit/fac9b1a97b30e037982db4c44ccc885b27d87c40))
* **swingset:** test-marshal.js: delete leftover+slow kernel creation ([beb9f59](https://github.com/Agoric/agoric-sdk/commit/beb9f59dd3c54d39663218dd9d96fc9988a16216))
* **swingset:** use better async style, improve comment ([64e4f2f](https://github.com/Agoric/agoric-sdk/commit/64e4f2f2c48b209b68d8a27c23b087f1ecd9a61c))
* newly missing fars ([#3557](https://github.com/Agoric/agoric-sdk/issues/3557)) ([32069cc](https://github.com/Agoric/agoric-sdk/commit/32069cc20e4e408cbc0c1881f36b44a3b9d24730))
* require virtual object selves to be declared Far ([619bbda](https://github.com/Agoric/agoric-sdk/commit/619bbda5223a2fe5168d7cb9851c5ac4dcc7cbac)), closes [#3562](https://github.com/Agoric/agoric-sdk/issues/3562)


### Code Refactoring

* **swingset:** Convert plugin API to NESM ([8ab2b03](https://github.com/Agoric/agoric-sdk/commit/8ab2b03970aa6735ad1f05756048a3dc09a190ce))
* **swingset:** Convert RESM to NESM ([bf7fd61](https://github.com/Agoric/agoric-sdk/commit/bf7fd6161a79e994c3bc48949e4ccb01b4048772))

### 0.26.10 (2021-07-28)


### ⚠ BREAKING CHANGES

* **swingset:** remove support for non-XS metering
* **swingset:** make dynamic vats unmetered by default

### Features

* first stage GC for virtual objects ([c1fb35c](https://github.com/Agoric/agoric-sdk/commit/c1fb35ce9bbc5299d9bef29e24b14c080c879d8d))
* **swingset:** add Meters to kernel state ([03f148b](https://github.com/Agoric/agoric-sdk/commit/03f148b20de7f0f7d5b56da63c8358dde8d7de16)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** implement Meters for crank computation charges ([7a7d616](https://github.com/Agoric/agoric-sdk/commit/7a7d61670baedf1968fd8086cdb8824bd006bad4)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** make dynamic vats unmetered by default ([c73dd8d](https://github.com/Agoric/agoric-sdk/commit/c73dd8d8ea3b7859313f245537f04dd6f92ba0c6)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** remove support for non-XS metering ([5b95638](https://github.com/Agoric/agoric-sdk/commit/5b9563849fa7ca2f26b4ca7c55f10d1d37334f46)), closes [#3518](https://github.com/Agoric/agoric-sdk/issues/3518)
* **SwingSet:** new `overrideVatManagerOptions` kernel option ([1ec045b](https://github.com/Agoric/agoric-sdk/commit/1ec045bad58ee7b5e9fccf36782793a3dd780337))
* **SwingSet:** plumb consensusMode for stricter determinism ([16ec7ca](https://github.com/Agoric/agoric-sdk/commit/16ec7ca688465aa0ee3fb9ed08be5be910c2554f))
* **SwingSet:** support more managers with consensusMode ([ea3280e](https://github.com/Agoric/agoric-sdk/commit/ea3280e061818f99681f2d9600ba140a1606671d))
* audit object refcounts ([d7c9792](https://github.com/Agoric/agoric-sdk/commit/d7c9792597d063fbc8970acb034674b15865de7d)), closes [#3445](https://github.com/Agoric/agoric-sdk/issues/3445)
* refactor object pinning ([9941a08](https://github.com/Agoric/agoric-sdk/commit/9941a086837ad4e6c314da5a6c4faa999430c3f4))
* utility to replace kernel bundle in kernel DB ([07b300e](https://github.com/Agoric/agoric-sdk/commit/07b300e2b7656e12ac4b011d0ebae73c9d8fa50c))


### Bug Fixes

* **swingset:** make test less sensitive to changes in metering ([e741be3](https://github.com/Agoric/agoric-sdk/commit/e741be3fbef8c746be476b13f9eb0d6e3e326dae)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3538](https://github.com/Agoric/agoric-sdk/issues/3538)
* various tweaks and cleanup in response to review comments ([fe777e4](https://github.com/Agoric/agoric-sdk/commit/fe777e4dde970fdfeb0189e2fbf12db68c160046))
* **swingset:** addEgress should cause an import/reachable refcount ([230b494](https://github.com/Agoric/agoric-sdk/commit/230b4948d112cf57393c91bb1bc53714efa37e58)), closes [#3483](https://github.com/Agoric/agoric-sdk/issues/3483)
* **swingset:** don't deduplicate inbound mailbox messages ([2018d76](https://github.com/Agoric/agoric-sdk/commit/2018d76bdbf8b16f72e9ec8a4af7786e8b4fb8cd)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442) [#3471](https://github.com/Agoric/agoric-sdk/issues/3471)
* **swingset:** don't pin the interior queueMessage promise ([4379f41](https://github.com/Agoric/agoric-sdk/commit/4379f41acf6a750f2edabf0e1bfb388cb53156c6)), closes [#3482](https://github.com/Agoric/agoric-sdk/issues/3482)
* **swingset:** gcAndFinalize needs two post-GC setImmediates on V8 ([#3486](https://github.com/Agoric/agoric-sdk/issues/3486)) ([cc9428f](https://github.com/Agoric/agoric-sdk/commit/cc9428f3c5b7d8d991f55904a958d339d3ff88d7)), closes [#3482](https://github.com/Agoric/agoric-sdk/issues/3482) [#3240](https://github.com/Agoric/agoric-sdk/issues/3240)
* **swingset:** processRefcounts() even if crank was aborted ([3320412](https://github.com/Agoric/agoric-sdk/commit/3320412be8db63df39a2ba60e1e30928d0741f16))
* **swingset:** test simultaneous underflow+notify, simplify kernel ([077dcec](https://github.com/Agoric/agoric-sdk/commit/077dcec47f2b999326846c561953b911f42c93f8)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** test/vat-controller-one: disregard non-message deliveries ([706be79](https://github.com/Agoric/agoric-sdk/commit/706be79bb611d82742c49ae0912045e891cbc773))
* better db location logic ([a76d3b7](https://github.com/Agoric/agoric-sdk/commit/a76d3b73e47052bacfd6b5137812356cf6953424))
* some missing Fars ([#3498](https://github.com/Agoric/agoric-sdk/issues/3498)) ([8f77271](https://github.com/Agoric/agoric-sdk/commit/8f77271b41a4589679ad95ff907126778466aba8))
* **SwingSet:** simplify makeVatConsole to always use a wrapper ([dc0839b](https://github.com/Agoric/agoric-sdk/commit/dc0839b44d489bccb3bdb9ab666c410863b15647))
* make verbose flag work from the very beginning ([7edfa24](https://github.com/Agoric/agoric-sdk/commit/7edfa24ca7ca8f511775791cef690bf482a7bc81))



## [0.20.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.6...@agoric/swingset-vat@0.20.0) (2021-08-14)


### ⚠ BREAKING CHANGES

* **swingset:** Convert plugin API to NESM
* **swingset:** Convert RESM to NESM

### Features

* **swingset:** add "run policy" object to controller.run() ([420edda](https://github.com/Agoric/agoric-sdk/commit/420edda2f8dd668cf84acc1b7cd0929bcbd79623)), closes [#3460](https://github.com/Agoric/agoric-sdk/issues/3460)
* **swingset:** hash kernel state changes into 'activityhash' ([47ec86b](https://github.com/Agoric/agoric-sdk/commit/47ec86be063f9021c91018dbc1f0952be543f0c7)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442)
* require that buildRootObject always returns a Far reference ([0cda623](https://github.com/Agoric/agoric-sdk/commit/0cda6230210add2bbedc40100dbfe8f0f8e98826))


### Bug Fixes

* **swingset:** define 'meterControl' to disable metering ([bdf8c08](https://github.com/Agoric/agoric-sdk/commit/bdf8c08ec2643217f507968bc9ae36fa548a8f69)), closes [#3458](https://github.com/Agoric/agoric-sdk/issues/3458)
* **swingset:** delete unused snapshots ([#3505](https://github.com/Agoric/agoric-sdk/issues/3505)) ([317959d](https://github.com/Agoric/agoric-sdk/commit/317959d77ca669c8e4bbf504d89fe55bdd383253)), closes [#3374](https://github.com/Agoric/agoric-sdk/issues/3374) [#3431](https://github.com/Agoric/agoric-sdk/issues/3431)
* **swingset:** Finish vat tool RESM to NESM conversion ([b6e943b](https://github.com/Agoric/agoric-sdk/commit/b6e943b6573bd75e408987a55a597198ec2ac00d))
* **swingset:** liveslots: disable metering of GC-sensitive calls ([a11a477](https://github.com/Agoric/agoric-sdk/commit/a11a477d867ab83415db9aff666f6d91f9ed6bd9)), closes [#3458](https://github.com/Agoric/agoric-sdk/issues/3458)
* **swingset:** move "kernelStats" into local/non-hashed DB space ([df8359e](https://github.com/Agoric/agoric-sdk/commit/df8359eca80e28736d294a558ed6c5e3b8b14127)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442)
* **swingset:** rename snapshot-related DB keys to be "local" ([e79e43c](https://github.com/Agoric/agoric-sdk/commit/e79e43c2776161b3f872a130131ad4a7b4c16e3f)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442)
* **swingset:** Support NESM importers ([fac9b1a](https://github.com/Agoric/agoric-sdk/commit/fac9b1a97b30e037982db4c44ccc885b27d87c40))
* **swingset:** test-marshal.js: delete leftover+slow kernel creation ([beb9f59](https://github.com/Agoric/agoric-sdk/commit/beb9f59dd3c54d39663218dd9d96fc9988a16216))
* **swingset:** use better async style, improve comment ([64e4f2f](https://github.com/Agoric/agoric-sdk/commit/64e4f2f2c48b209b68d8a27c23b087f1ecd9a61c))
* newly missing fars ([#3557](https://github.com/Agoric/agoric-sdk/issues/3557)) ([32069cc](https://github.com/Agoric/agoric-sdk/commit/32069cc20e4e408cbc0c1881f36b44a3b9d24730))
* require virtual object selves to be declared Far ([619bbda](https://github.com/Agoric/agoric-sdk/commit/619bbda5223a2fe5168d7cb9851c5ac4dcc7cbac)), closes [#3562](https://github.com/Agoric/agoric-sdk/issues/3562)


### Code Refactoring

* **swingset:** Convert plugin API to NESM ([8ab2b03](https://github.com/Agoric/agoric-sdk/commit/8ab2b03970aa6735ad1f05756048a3dc09a190ce))
* **swingset:** Convert RESM to NESM ([bf7fd61](https://github.com/Agoric/agoric-sdk/commit/bf7fd6161a79e994c3bc48949e4ccb01b4048772))

### 0.26.10 (2021-07-28)


### ⚠ BREAKING CHANGES

* **swingset:** remove support for non-XS metering
* **swingset:** make dynamic vats unmetered by default

### Features

* first stage GC for virtual objects ([c1fb35c](https://github.com/Agoric/agoric-sdk/commit/c1fb35ce9bbc5299d9bef29e24b14c080c879d8d))
* **swingset:** add Meters to kernel state ([03f148b](https://github.com/Agoric/agoric-sdk/commit/03f148b20de7f0f7d5b56da63c8358dde8d7de16)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** implement Meters for crank computation charges ([7a7d616](https://github.com/Agoric/agoric-sdk/commit/7a7d61670baedf1968fd8086cdb8824bd006bad4)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** make dynamic vats unmetered by default ([c73dd8d](https://github.com/Agoric/agoric-sdk/commit/c73dd8d8ea3b7859313f245537f04dd6f92ba0c6)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** remove support for non-XS metering ([5b95638](https://github.com/Agoric/agoric-sdk/commit/5b9563849fa7ca2f26b4ca7c55f10d1d37334f46)), closes [#3518](https://github.com/Agoric/agoric-sdk/issues/3518)
* **SwingSet:** new `overrideVatManagerOptions` kernel option ([1ec045b](https://github.com/Agoric/agoric-sdk/commit/1ec045bad58ee7b5e9fccf36782793a3dd780337))
* **SwingSet:** plumb consensusMode for stricter determinism ([16ec7ca](https://github.com/Agoric/agoric-sdk/commit/16ec7ca688465aa0ee3fb9ed08be5be910c2554f))
* **SwingSet:** support more managers with consensusMode ([ea3280e](https://github.com/Agoric/agoric-sdk/commit/ea3280e061818f99681f2d9600ba140a1606671d))
* audit object refcounts ([d7c9792](https://github.com/Agoric/agoric-sdk/commit/d7c9792597d063fbc8970acb034674b15865de7d)), closes [#3445](https://github.com/Agoric/agoric-sdk/issues/3445)
* refactor object pinning ([9941a08](https://github.com/Agoric/agoric-sdk/commit/9941a086837ad4e6c314da5a6c4faa999430c3f4))
* utility to replace kernel bundle in kernel DB ([07b300e](https://github.com/Agoric/agoric-sdk/commit/07b300e2b7656e12ac4b011d0ebae73c9d8fa50c))


### Bug Fixes

* **swingset:** make test less sensitive to changes in metering ([e741be3](https://github.com/Agoric/agoric-sdk/commit/e741be3fbef8c746be476b13f9eb0d6e3e326dae)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3538](https://github.com/Agoric/agoric-sdk/issues/3538)
* various tweaks and cleanup in response to review comments ([fe777e4](https://github.com/Agoric/agoric-sdk/commit/fe777e4dde970fdfeb0189e2fbf12db68c160046))
* **swingset:** addEgress should cause an import/reachable refcount ([230b494](https://github.com/Agoric/agoric-sdk/commit/230b4948d112cf57393c91bb1bc53714efa37e58)), closes [#3483](https://github.com/Agoric/agoric-sdk/issues/3483)
* **swingset:** don't deduplicate inbound mailbox messages ([2018d76](https://github.com/Agoric/agoric-sdk/commit/2018d76bdbf8b16f72e9ec8a4af7786e8b4fb8cd)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442) [#3471](https://github.com/Agoric/agoric-sdk/issues/3471)
* **swingset:** don't pin the interior queueMessage promise ([4379f41](https://github.com/Agoric/agoric-sdk/commit/4379f41acf6a750f2edabf0e1bfb388cb53156c6)), closes [#3482](https://github.com/Agoric/agoric-sdk/issues/3482)
* **swingset:** gcAndFinalize needs two post-GC setImmediates on V8 ([#3486](https://github.com/Agoric/agoric-sdk/issues/3486)) ([cc9428f](https://github.com/Agoric/agoric-sdk/commit/cc9428f3c5b7d8d991f55904a958d339d3ff88d7)), closes [#3482](https://github.com/Agoric/agoric-sdk/issues/3482) [#3240](https://github.com/Agoric/agoric-sdk/issues/3240)
* **swingset:** processRefcounts() even if crank was aborted ([3320412](https://github.com/Agoric/agoric-sdk/commit/3320412be8db63df39a2ba60e1e30928d0741f16))
* **swingset:** test simultaneous underflow+notify, simplify kernel ([077dcec](https://github.com/Agoric/agoric-sdk/commit/077dcec47f2b999326846c561953b911f42c93f8)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** test/vat-controller-one: disregard non-message deliveries ([706be79](https://github.com/Agoric/agoric-sdk/commit/706be79bb611d82742c49ae0912045e891cbc773))
* better db location logic ([a76d3b7](https://github.com/Agoric/agoric-sdk/commit/a76d3b73e47052bacfd6b5137812356cf6953424))
* some missing Fars ([#3498](https://github.com/Agoric/agoric-sdk/issues/3498)) ([8f77271](https://github.com/Agoric/agoric-sdk/commit/8f77271b41a4589679ad95ff907126778466aba8))
* **SwingSet:** simplify makeVatConsole to always use a wrapper ([dc0839b](https://github.com/Agoric/agoric-sdk/commit/dc0839b44d489bccb3bdb9ab666c410863b15647))
* make verbose flag work from the very beginning ([7edfa24](https://github.com/Agoric/agoric-sdk/commit/7edfa24ca7ca8f511775791cef690bf482a7bc81))



## [0.19.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.6...@agoric/swingset-vat@0.19.0) (2021-07-28)


### ⚠ BREAKING CHANGES

* **swingset:** remove support for non-XS metering
* **swingset:** make dynamic vats unmetered by default

### Features

* first stage GC for virtual objects ([c1fb35c](https://github.com/Agoric/agoric-sdk/commit/c1fb35ce9bbc5299d9bef29e24b14c080c879d8d))
* **swingset:** add Meters to kernel state ([03f148b](https://github.com/Agoric/agoric-sdk/commit/03f148b20de7f0f7d5b56da63c8358dde8d7de16)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** implement Meters for crank computation charges ([7a7d616](https://github.com/Agoric/agoric-sdk/commit/7a7d61670baedf1968fd8086cdb8824bd006bad4)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** make dynamic vats unmetered by default ([c73dd8d](https://github.com/Agoric/agoric-sdk/commit/c73dd8d8ea3b7859313f245537f04dd6f92ba0c6)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** remove support for non-XS metering ([5b95638](https://github.com/Agoric/agoric-sdk/commit/5b9563849fa7ca2f26b4ca7c55f10d1d37334f46)), closes [#3518](https://github.com/Agoric/agoric-sdk/issues/3518)
* **SwingSet:** new `overrideVatManagerOptions` kernel option ([1ec045b](https://github.com/Agoric/agoric-sdk/commit/1ec045bad58ee7b5e9fccf36782793a3dd780337))
* **SwingSet:** plumb consensusMode for stricter determinism ([16ec7ca](https://github.com/Agoric/agoric-sdk/commit/16ec7ca688465aa0ee3fb9ed08be5be910c2554f))
* **SwingSet:** support more managers with consensusMode ([ea3280e](https://github.com/Agoric/agoric-sdk/commit/ea3280e061818f99681f2d9600ba140a1606671d))
* audit object refcounts ([d7c9792](https://github.com/Agoric/agoric-sdk/commit/d7c9792597d063fbc8970acb034674b15865de7d)), closes [#3445](https://github.com/Agoric/agoric-sdk/issues/3445)
* refactor object pinning ([9941a08](https://github.com/Agoric/agoric-sdk/commit/9941a086837ad4e6c314da5a6c4faa999430c3f4))
* utility to replace kernel bundle in kernel DB ([07b300e](https://github.com/Agoric/agoric-sdk/commit/07b300e2b7656e12ac4b011d0ebae73c9d8fa50c))


### Bug Fixes

* **swingset:** make test less sensitive to changes in metering ([e741be3](https://github.com/Agoric/agoric-sdk/commit/e741be3fbef8c746be476b13f9eb0d6e3e326dae)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308) [#3538](https://github.com/Agoric/agoric-sdk/issues/3538)
* various tweaks and cleanup in response to review comments ([fe777e4](https://github.com/Agoric/agoric-sdk/commit/fe777e4dde970fdfeb0189e2fbf12db68c160046))
* **swingset:** addEgress should cause an import/reachable refcount ([230b494](https://github.com/Agoric/agoric-sdk/commit/230b4948d112cf57393c91bb1bc53714efa37e58)), closes [#3483](https://github.com/Agoric/agoric-sdk/issues/3483)
* **swingset:** don't deduplicate inbound mailbox messages ([2018d76](https://github.com/Agoric/agoric-sdk/commit/2018d76bdbf8b16f72e9ec8a4af7786e8b4fb8cd)), closes [#3442](https://github.com/Agoric/agoric-sdk/issues/3442) [#3471](https://github.com/Agoric/agoric-sdk/issues/3471)
* **swingset:** don't pin the interior queueMessage promise ([4379f41](https://github.com/Agoric/agoric-sdk/commit/4379f41acf6a750f2edabf0e1bfb388cb53156c6)), closes [#3482](https://github.com/Agoric/agoric-sdk/issues/3482)
* **swingset:** gcAndFinalize needs two post-GC setImmediates on V8 ([#3486](https://github.com/Agoric/agoric-sdk/issues/3486)) ([cc9428f](https://github.com/Agoric/agoric-sdk/commit/cc9428f3c5b7d8d991f55904a958d339d3ff88d7)), closes [#3482](https://github.com/Agoric/agoric-sdk/issues/3482) [#3240](https://github.com/Agoric/agoric-sdk/issues/3240)
* **swingset:** processRefcounts() even if crank was aborted ([3320412](https://github.com/Agoric/agoric-sdk/commit/3320412be8db63df39a2ba60e1e30928d0741f16))
* **swingset:** test simultaneous underflow+notify, simplify kernel ([077dcec](https://github.com/Agoric/agoric-sdk/commit/077dcec47f2b999326846c561953b911f42c93f8)), closes [#3308](https://github.com/Agoric/agoric-sdk/issues/3308)
* **swingset:** test/vat-controller-one: disregard non-message deliveries ([706be79](https://github.com/Agoric/agoric-sdk/commit/706be79bb611d82742c49ae0912045e891cbc773))
* better db location logic ([a76d3b7](https://github.com/Agoric/agoric-sdk/commit/a76d3b73e47052bacfd6b5137812356cf6953424))
* some missing Fars ([#3498](https://github.com/Agoric/agoric-sdk/issues/3498)) ([8f77271](https://github.com/Agoric/agoric-sdk/commit/8f77271b41a4589679ad95ff907126778466aba8))
* **SwingSet:** simplify makeVatConsole to always use a wrapper ([dc0839b](https://github.com/Agoric/agoric-sdk/commit/dc0839b44d489bccb3bdb9ab666c410863b15647))
* make verbose flag work from the very beginning ([7edfa24](https://github.com/Agoric/agoric-sdk/commit/7edfa24ca7ca8f511775791cef690bf482a7bc81))



### [0.18.6](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.5...@agoric/swingset-vat@0.18.6) (2021-07-01)


### Features

* issue 3161, track recognizable objects used by VOM so other objects can be GC'd ([85303c5](https://github.com/Agoric/agoric-sdk/commit/85303c5290e3606132aca00b1fc5afa748ea89a3))


### Bug Fixes

* **swingset:** don't perturb XS heap state when loading snapshot ([52171a1](https://github.com/Agoric/agoric-sdk/commit/52171a12af41b326b07024735aad5b18e883a9b5))
* make 'bootstrap export' test less sensitive to cross-engine GC variation ([9be7dfc](https://github.com/Agoric/agoric-sdk/commit/9be7dfcf137a8457c3e577e15b94ee01400825ca))



### [0.18.5](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.4...@agoric/swingset-vat@0.18.5) (2021-06-28)


### Features

* demand-paged vats are reloaded from heap snapshots ([#2848](https://github.com/Agoric/agoric-sdk/issues/2848)) ([cb239cb](https://github.com/Agoric/agoric-sdk/commit/cb239cbb27943ad58c304d85ee9b61ba917af79c)), closes [#2273](https://github.com/Agoric/agoric-sdk/issues/2273) [#2277](https://github.com/Agoric/agoric-sdk/issues/2277) [#2422](https://github.com/Agoric/agoric-sdk/issues/2422)



### [0.18.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.3...@agoric/swingset-vat@0.18.4) (2021-06-25)


### Features

* **swingset:** introduce 'xs-worker-no-gc' for forward compat ([e46cd88](https://github.com/Agoric/agoric-sdk/commit/e46cd883449c02559e2c0c49b66e26695b4b99da))



### [0.18.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.2...@agoric/swingset-vat@0.18.3) (2021-06-24)


### Bug Fixes

* maybe the best of both worlds: xs-worker but no explicit gc() ([8d38e9a](https://github.com/Agoric/agoric-sdk/commit/8d38e9a3d50987cd21e642e330d482e6e733cd3c))



### [0.18.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.1...@agoric/swingset-vat@0.18.2) (2021-06-24)

**Note:** Version bump only for package @agoric/swingset-vat





### [0.18.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.18.0...@agoric/swingset-vat@0.18.1) (2021-06-23)


### Features

* **swingset:** comms state: add object refcounts ([98a2038](https://github.com/Agoric/agoric-sdk/commit/98a20383eb48c5481cf8d005855cce4c6e31a25b))
* **swingset:** comms: add importer tracking ([72f29fa](https://github.com/Agoric/agoric-sdk/commit/72f29fabdc8945b813916787ce93a6083db54f04)), closes [#3223](https://github.com/Agoric/agoric-sdk/issues/3223)
* **swingset:** comms: add/manipulate isReachable flag ([133bbae](https://github.com/Agoric/agoric-sdk/commit/133bbae35ac08f3883380682944ffd606ba638bf))
* **swingset:** comms: enable object tracking in processMaybeFree() ([160026d](https://github.com/Agoric/agoric-sdk/commit/160026d079d3cf94b6423f20033eff1c2a655a55))
* **swingset:** comms: track lastSent seqnum for each object ([03cdce8](https://github.com/Agoric/agoric-sdk/commit/03cdce83d415d9f9c981a669a2500808ff6a23e0))
* **swingset:** implement comms GC, wire everything into place ([c901eb6](https://github.com/Agoric/agoric-sdk/commit/c901eb6eb41f49b7978352aee9ddad23ad8420d5)), closes [#3306](https://github.com/Agoric/agoric-sdk/issues/3306)
* **swingset:** record xs-workers to $XSNAP_TEST_RECORD if set ([#3392](https://github.com/Agoric/agoric-sdk/issues/3392)) ([bacec84](https://github.com/Agoric/agoric-sdk/commit/bacec84f238372543c918ca9032de065a537d44c))


### Bug Fixes

* **swingset:** comms: deleteKernelMapping might free the object ([a3bf097](https://github.com/Agoric/agoric-sdk/commit/a3bf0977abcea7dbef0c89b6c96887ac3f305dbe))
* **swingset:** comms: deleteRemoteMapping might free the object ([e97a21d](https://github.com/Agoric/agoric-sdk/commit/e97a21dca0c6374783331d5d59a9d3047ba7e778))
* **swingset:** comms: remove deleteToRemoteMapping ([6d15240](https://github.com/Agoric/agoric-sdk/commit/6d152401e90804e664a812d7d8d651a7f812be30)), closes [#3306](https://github.com/Agoric/agoric-sdk/issues/3306)
* **swingset:** comms: single-argument delete-mapping functions ([7a79d14](https://github.com/Agoric/agoric-sdk/commit/7a79d146bc0ea9d245f2b0fc9befa4d5305929ff))
* **swingset:** fix GC handling of orphaned objects ([dcfe169](https://github.com/Agoric/agoric-sdk/commit/dcfe16929e8b352fe1318f34b8d1f0367e52fbb1)), closes [#3376](https://github.com/Agoric/agoric-sdk/issues/3376) [#3377](https://github.com/Agoric/agoric-sdk/issues/3377) [#3378](https://github.com/Agoric/agoric-sdk/issues/3378) [#3376](https://github.com/Agoric/agoric-sdk/issues/3376) [#3377](https://github.com/Agoric/agoric-sdk/issues/3377) [#3378](https://github.com/Agoric/agoric-sdk/issues/3378)
* **swingset:** only mark refs for processing if refcount hits zero ([3354bbf](https://github.com/Agoric/agoric-sdk/commit/3354bbf6e100dcd96a0813b15a8bae0dfffa80d3)), closes [#3106](https://github.com/Agoric/agoric-sdk/issues/3106)
* **swingset:** test-comms.js: fix retireImports test ([ba1f244](https://github.com/Agoric/agoric-sdk/commit/ba1f244a6bd58e6d70013a730edec4c6e2b2b367))
* **swingset:** xs-worker confused meter exhaustion with process fail ([#3396](https://github.com/Agoric/agoric-sdk/issues/3396)) ([54ccc21](https://github.com/Agoric/agoric-sdk/commit/54ccc21d77b2324125626c0c928287d584d04244))
* **SwingSet:** Lint fix for vat controller test fixture ([33298d8](https://github.com/Agoric/agoric-sdk/commit/33298d8b4c984eeadfa5d0e415a6cdc6a0d77382))
* **SwingSet:** protect against null kpid when resolving errors ([8f38d01](https://github.com/Agoric/agoric-sdk/commit/8f38d01eae8ba9b9c849e66cc1c16efa4416a7bb))
* **SwingSet:** Use extension for vat-controller jig ([c301496](https://github.com/Agoric/agoric-sdk/commit/c301496b53d27aa5541c425561006bce750d9592))



## [0.18.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.17.3...@agoric/swingset-vat@0.18.0) (2021-06-16)


### ⚠ BREAKING CHANGES

* **swingset:** remove stats from vatAdmin API

### Bug Fixes

* **liveslots:** better error message when buildRootObject is not Far ([34568a9](https://github.com/Agoric/agoric-sdk/commit/34568a922c704681ec7afc8803bb7ffdb14c2999))
* **swingset:** add kernel processing of GC actions before each crank ([462e9fd](https://github.com/Agoric/agoric-sdk/commit/462e9fd36bd5a74dce45ca5a592393b855488e00))
* **swingset:** fix two tests which failed under XS GC ([1ba9224](https://github.com/Agoric/agoric-sdk/commit/1ba9224bc3d6dd67cd1e306f2f284fa10222b4da)), closes [#3240](https://github.com/Agoric/agoric-sdk/issues/3240)
* **swingset:** remove stats from vatAdmin API ([03e7062](https://github.com/Agoric/agoric-sdk/commit/03e7062195684ecf602910198467549a46ef6d52)), closes [#3331](https://github.com/Agoric/agoric-sdk/issues/3331)
* **swingset:** retain more references ([5ace0aa](https://github.com/Agoric/agoric-sdk/commit/5ace0aa302e3b89561f0efc43c48a11cf7ced14b))
* **swingset:** rewrite kernelKeeper.cleanupAfterTerminatedVat ([43a4ff8](https://github.com/Agoric/agoric-sdk/commit/43a4ff853e0182fac41bd3fb0026c6dd9a1a50e3))



### [0.17.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.17.2...@agoric/swingset-vat@0.17.3) (2021-06-15)


### Features

* make vatstore optionally available to vats as a vat power ([229da78](https://github.com/Agoric/agoric-sdk/commit/229da78b42eec89e55803ba3f3f870f86e351286))
* **swingset:** vatKeeper.getOptions() avoids loading source ([4ea2be9](https://github.com/Agoric/agoric-sdk/commit/4ea2be98016593f94e716f4ef1385af60206b9ac)), closes [#3280](https://github.com/Agoric/agoric-sdk/issues/3280)
* don't load unendowed devices ([d6c1de6](https://github.com/Agoric/agoric-sdk/commit/d6c1de636d49c1379e25b27e369ada9e68cfb237))
* modify all SwingStore uses to reflect constructor renaming ([9cda6a4](https://github.com/Agoric/agoric-sdk/commit/9cda6a4542bb64d72ddd42d08e2056f5323b18a9))
* move transcripts out of key-value store and into stream stores ([a128e93](https://github.com/Agoric/agoric-sdk/commit/a128e93803344d8a36140d53d3e7711bec5c2511))
* propery handle remotables vs presences in weak collections ([e4a32a2](https://github.com/Agoric/agoric-sdk/commit/e4a32a21a22be69475439ca719d80143cbdb1d9a))
* support vats without transcripts, notably the comms vat (to start with) ([18d6050](https://github.com/Agoric/agoric-sdk/commit/18d6050150dae08f03319ca2ffae0fd985e92164)), closes [#3217](https://github.com/Agoric/agoric-sdk/issues/3217)
* tools for fiddling with kernel DB ([d14fa1e](https://github.com/Agoric/agoric-sdk/commit/d14fa1e85eb4e5be2c8eec4ac0af7f0cffbdc3c7))
* use 'engine-gc.js' to get the Node.js garbage collector ([0153529](https://github.com/Agoric/agoric-sdk/commit/0153529cbfc0b7da2d1ec434b32b2171bc246f93))
* use WeakRefs to ensure virtual objects have at most one representative apiece ([031c8d0](https://github.com/Agoric/agoric-sdk/commit/031c8d08e3dddb6de050070800903231e8839787))
* vat warehouse for LRU demand paged vats ([#2784](https://github.com/Agoric/agoric-sdk/issues/2784)) ([05f3038](https://github.com/Agoric/agoric-sdk/commit/05f3038c36399e0f47005299479846f2a9a9c649))
* **swingset:** drop Presences, activate `syscall.dropImports` ([84e383a](https://github.com/Agoric/agoric-sdk/commit/84e383a409846f2b6d38c2d443fd390d65da5d30)), closes [#3161](https://github.com/Agoric/agoric-sdk/issues/3161) [#3147](https://github.com/Agoric/agoric-sdk/issues/3147) [#2615](https://github.com/Agoric/agoric-sdk/issues/2615) [#2660](https://github.com/Agoric/agoric-sdk/issues/2660)
* **swingset:** expose writeSlogObject to host application ([851fa61](https://github.com/Agoric/agoric-sdk/commit/851fa6194549973607b75ae949f3d0d990fb2bb2))
* **SwingSet:** add "reachable" flag to clist entries ([4b843a8](https://github.com/Agoric/agoric-sdk/commit/4b843a87f82d9a9045491ef943429e2043b747b2)), closes [#3108](https://github.com/Agoric/agoric-sdk/issues/3108)
* **SwingSet:** change virtualObjectManager API to reduce authority ([65d2e17](https://github.com/Agoric/agoric-sdk/commit/65d2e17becbe15aa6d60c75993209111e10c6af4))
* **SwingSet:** makeFakeVirtualObjectManager() takes options bag ([40bbdee](https://github.com/Agoric/agoric-sdk/commit/40bbdee873d73437e9f19c46688db785b8300bff))
* wrap WeakMap and WeakSet to hide virtual object non-determinism ([bd421ff](https://github.com/Agoric/agoric-sdk/commit/bd421ff1aac2c7dfcc2fd1d035acbc778ab9c4ad))


### Bug Fixes

* **swingset:** activate `dispatch.dropExports` ([0625f14](https://github.com/Agoric/agoric-sdk/commit/0625f14ebc1c4fabf5bd4d6e7b1855a29c1466b8)), closes [#3137](https://github.com/Agoric/agoric-sdk/issues/3137)
* **swingset:** add 'slogFile' option to buildVatController() ([127e18e](https://github.com/Agoric/agoric-sdk/commit/127e18ecfd1616088f1e1fd9370e79bccd0704a3))
* **swingset:** fix refcounts for messages queued to a promise ([0da6eea](https://github.com/Agoric/agoric-sdk/commit/0da6eea9f3b25971b9cbca5352bd2f1ebd8f30f1)), closes [#3264](https://github.com/Agoric/agoric-sdk/issues/3264) [#3264](https://github.com/Agoric/agoric-sdk/issues/3264)
* **swingset:** gc-actions: new algorithm, update test ([6c85e21](https://github.com/Agoric/agoric-sdk/commit/6c85e21831f0c3f867686d4b5f5f66a25f1acdeb))
* **swingset:** hold strong reference to all device nodes ([2a07d8e](https://github.com/Agoric/agoric-sdk/commit/2a07d8e03a96bb6d370040b39f54e338484efe75))
* **swingset:** implement dispatch.retireExports for Remotables ([e8b0f3a](https://github.com/Agoric/agoric-sdk/commit/e8b0f3a01a2ece7c58cf653e8956754d3ebbb9e0))
* **swingset:** remove liveslots "safety pins" ([549c301](https://github.com/Agoric/agoric-sdk/commit/549c3019c3513cfeb35211bc42178cd0102c6543)), closes [#3106](https://github.com/Agoric/agoric-sdk/issues/3106)
* **swingset:** tolerate policy='none' in queueToVatExport ([433efe2](https://github.com/Agoric/agoric-sdk/commit/433efe2689ee9035079a92fb5e1cb8b0deff4ce9))
* **swingset:** use provideVatSlogger inside the slogger ([7848b16](https://github.com/Agoric/agoric-sdk/commit/7848b16de6a754ed80c52afd55e6bf12f054d2b2))
* be more explicit when gc() is not enabled, but not repetitive ([b3f7757](https://github.com/Agoric/agoric-sdk/commit/b3f775704a2a9373623d3c6f24726e14ec8d0056))
* bug [#3022](https://github.com/Agoric/agoric-sdk/issues/3022), off-by-one in slog deliveryNum ([620dcb5](https://github.com/Agoric/agoric-sdk/commit/620dcb5b9dd3dc2c9286aa50d4e03487ca341308))
* detect extra syscalls in replay ([6b6f837](https://github.com/Agoric/agoric-sdk/commit/6b6f837b54b97885b725d408de480222232fec45))
* don't drag in the entire metering transform to kernel ([4db01ca](https://github.com/Agoric/agoric-sdk/commit/4db01ca9b31364accc8393e56f78b136b1461b2f))
* don't go to the head of the LRU unless touching the data ([cbabcc9](https://github.com/Agoric/agoric-sdk/commit/cbabcc9588dbe0f35c0ca10e9a4ca44e93788870))
* ensure replacements of globals can't be bypassed ([3d2a230](https://github.com/Agoric/agoric-sdk/commit/3d2a230822eed17e87a62ebe9df2609d9dcaa372))
* excise @babel/core except from ui-components ([af564f1](https://github.com/Agoric/agoric-sdk/commit/af564f1705bbd8fc53c027e70140a02641b23fa0))
* incorporate changes from review feedback ([dcca675](https://github.com/Agoric/agoric-sdk/commit/dcca6750df50f6db4daff4f794968450a43d1b0e))
* inner self needs to point to representative to survive GC while in LRU ([26f9a41](https://github.com/Agoric/agoric-sdk/commit/26f9a416e2f059b0589917d88193739b946ee7a3))
* make loopbox device compatible with replay ([ce11fff](https://github.com/Agoric/agoric-sdk/commit/ce11fff37da1d1856d4bb6458b08d7ae73267175)), closes [#3260](https://github.com/Agoric/agoric-sdk/issues/3260)
* Pin ESM to forked version ([54dbb55](https://github.com/Agoric/agoric-sdk/commit/54dbb55d64d7ff7adb395bc4bd9d1461dd2d3c17))
* Preinitialize Babel ([bb76808](https://github.com/Agoric/agoric-sdk/commit/bb768089c3588e54612d7c9a4528972b5688f4e6))
* Sync versions locally ([90b07d8](https://github.com/Agoric/agoric-sdk/commit/90b07d8faef4d30ae07e909548ce2798db7dd816))
* **swingset:** add gcAndFinalize, tests ([d4bc617](https://github.com/Agoric/agoric-sdk/commit/d4bc61724365ae7eefb64459c7aefb5f2189e4b1)), closes [#2660](https://github.com/Agoric/agoric-sdk/issues/2660)
* **swingset:** do not record GC syscalls in the transcript ([d18ddf5](https://github.com/Agoric/agoric-sdk/commit/d18ddf56815c61737388c76324e98ad7a001ffb2)), closes [#3146](https://github.com/Agoric/agoric-sdk/issues/3146) [#2615](https://github.com/Agoric/agoric-sdk/issues/2615) [#2660](https://github.com/Agoric/agoric-sdk/issues/2660) [#2724](https://github.com/Agoric/agoric-sdk/issues/2724)
* **swingset:** factor out replayOneDelivery from manager helper ([e45f5ad](https://github.com/Agoric/agoric-sdk/commit/e45f5ad1772915f239d9f888a72468ba37136396))
* **swingset:** include vatParameters in slogfile create-vat records ([8216cde](https://github.com/Agoric/agoric-sdk/commit/8216cde7e5668341c971070dfe5157221a0c398f))
* **swingset:** track exported Remotables during export, not serialization ([0bc31e9](https://github.com/Agoric/agoric-sdk/commit/0bc31e9928ac836df675f7b8a48f344b6cbb4bb2))
* **swingset:** track pendingPromises ([fe93b3d](https://github.com/Agoric/agoric-sdk/commit/fe93b3dba3b023e0d8255584add3aabaf11dfea1))
* **SwingSet:** enable getKeys('','') in blockBuffer/crankBuffer ([ff6af69](https://github.com/Agoric/agoric-sdk/commit/ff6af6926cb9bac29873f84a85ad409e0ef0f588))
* **SwingSet:** let vatManager creator override syscall comparison ([94f3740](https://github.com/Agoric/agoric-sdk/commit/94f37408db7cb93917cb1e8495f203ee2871f909))
* **SwingSet:** makeFakeVirtualObjectManager takes weak=true ([e3ab2e1](https://github.com/Agoric/agoric-sdk/commit/e3ab2e191f77cd24e5752c574cd79effd46c5f99))
* **SwingSet:** VOM retains Remotables used in virtualized data ([e4ed4c0](https://github.com/Agoric/agoric-sdk/commit/e4ed4c0a7ec5da715c88c06d0a69b167f3f4dedc)), closes [#3132](https://github.com/Agoric/agoric-sdk/issues/3132) [#3106](https://github.com/Agoric/agoric-sdk/issues/3106)
* **SwingSet:** VOM tracks Presence vrefs in virtualized data ([71c85ec](https://github.com/Agoric/agoric-sdk/commit/71c85ecb372c321d5a1f935952aa31b510007498)), closes [#3133](https://github.com/Agoric/agoric-sdk/issues/3133) [#3106](https://github.com/Agoric/agoric-sdk/issues/3106)
* **xs-worker:** respect !managerOptions.metered ([#3078](https://github.com/Agoric/agoric-sdk/issues/3078)) ([84fa8c9](https://github.com/Agoric/agoric-sdk/commit/84fa8c984bc0bccb2482007d69dfb01773de6c74))
* remove references to @agoric/babel-parser ([e4b1e2b](https://github.com/Agoric/agoric-sdk/commit/e4b1e2b4bb13436ef53f055136a4a1d5d933d99e))
* solve nondeterminism in rollup2 output order ([c72b52d](https://github.com/Agoric/agoric-sdk/commit/c72b52d69d5ca4609ce648f24c9d30f66b200374))
* upgrade acorn and babel parser ([048cc92](https://github.com/Agoric/agoric-sdk/commit/048cc925b3090f77e998fef1f3ac26846c4a8f26))



## [0.17.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.17.1...@agoric/swingset-vat@0.17.2) (2021-05-10)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.17.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.17.0...@agoric/swingset-vat@0.17.1) (2021-05-05)


### Bug Fixes

* **swingset:** force vattp to run on worker=local for now ([a6aff0a](https://github.com/Agoric/agoric-sdk/commit/a6aff0ac52de6ecd12b9b1c5c82958f502b549b3)), closes [#3039](https://github.com/Agoric/agoric-sdk/issues/3039)





# [0.17.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.16.4...@agoric/swingset-vat@0.17.0) (2021-05-05)


### Bug Fixes

* disable comms vat termination via remote comms errors ([d286fbd](https://github.com/Agoric/agoric-sdk/commit/d286fbde334433a27ac21709797e6c10cd7f8599))
* **liveslots:** low-level vat dispatch() is now async ([1a6ae48](https://github.com/Agoric/agoric-sdk/commit/1a6ae480c74993f2dc620079e27640a1ba536802)), closes [#2671](https://github.com/Agoric/agoric-sdk/issues/2671) [#2660](https://github.com/Agoric/agoric-sdk/issues/2660)
* **swingset:** add GC stubs: syscall/dispatch retireImports/Exports ([fa24bb9](https://github.com/Agoric/agoric-sdk/commit/fa24bb991d69fd01d410685c867578590f99249b)), closes [#2724](https://github.com/Agoric/agoric-sdk/issues/2724)
* **swingset:** create dynamic vats with the right options ([66fc842](https://github.com/Agoric/agoric-sdk/commit/66fc8423f57101998394c0e31e539d0c0d0ac8c7))
* **swingset:** disable GC for now ([e93066f](https://github.com/Agoric/agoric-sdk/commit/e93066f7b9bebecced901fcb7cbf5d445f78dcf9)), closes [#2724](https://github.com/Agoric/agoric-sdk/issues/2724)
* **swingset:** recreateDynamicVat() waits for vat creation ([fe6ab38](https://github.com/Agoric/agoric-sdk/commit/fe6ab38be097e2a9ec525704f3f346fda68eaf64)), closes [#2871](https://github.com/Agoric/agoric-sdk/issues/2871)
* **swingset:** refactor dispatch() ([ec2e993](https://github.com/Agoric/agoric-sdk/commit/ec2e993f53f168531010b8ad09a197109d33a425))
* **swingset:** schedule vat creation on the run-queue ([51cf813](https://github.com/Agoric/agoric-sdk/commit/51cf813b248fc97966566f5f73c7d351ae646869)), closes [#2911](https://github.com/Agoric/agoric-sdk/issues/2911)
* **swingset:** speed up vat-admin tests by pre-bundling the kernel ([51d06e8](https://github.com/Agoric/agoric-sdk/commit/51d06e8827558ba9ae30c9d4e0e5bd7adf59a1b0))
* **swingset:** stop rejecting metered=true for xs-worker ([3714ed9](https://github.com/Agoric/agoric-sdk/commit/3714ed9fc5b62b39b2c04e7b24bb6e985268036a)), closes [#2868](https://github.com/Agoric/agoric-sdk/issues/2868)
* **swingset:** supervisor-xs: tolerate console.log(BigInt) ([#2967](https://github.com/Agoric/agoric-sdk/issues/2967)) ([cddd949](https://github.com/Agoric/agoric-sdk/commit/cddd949d3d8e986c24feb6af5bdf6be606af9374)), closes [#2936](https://github.com/Agoric/agoric-sdk/issues/2936)
* **swingset:** test metering on both local and xsnap workers ([1e50fa4](https://github.com/Agoric/agoric-sdk/commit/1e50fa49286a9a3240d17dd53b4e645577f4bbc2)), closes [#2972](https://github.com/Agoric/agoric-sdk/issues/2972)
* **xs-worker:** provide error message on vat creation failure ([6a1705e](https://github.com/Agoric/agoric-sdk/commit/6a1705edc5565f6b0320f40e1496a230fd3ad8f3))
* add missing syscalls to kernel stats collection ([1617918](https://github.com/Agoric/agoric-sdk/commit/1617918378bf8fb76e33b55068c43d0e0e278706))
* add noIbids option ([#2886](https://github.com/Agoric/agoric-sdk/issues/2886)) ([39388bc](https://github.com/Agoric/agoric-sdk/commit/39388bc6b96c6b05b807d8c44614b9acb670467d))
* add tests and correct issues the tests found ([0d42e64](https://github.com/Agoric/agoric-sdk/commit/0d42e649866ee93d95d7bf8985d95f455d08a736))
* handle transient 0 refCounts correctly ([9975d75](https://github.com/Agoric/agoric-sdk/commit/9975d7505773f1573325219ccf908291aafee4df))
* incorporate review feedback and other bits of tidying up ([235957b](https://github.com/Agoric/agoric-sdk/commit/235957b8e4c845f00e0fe4bb93c37f4cd18d8fd2))
* remove deprecated ibid support ([#2898](https://github.com/Agoric/agoric-sdk/issues/2898)) ([f865a2a](https://github.com/Agoric/agoric-sdk/commit/f865a2a8fb5d6cb1d16d9fc21ad4868ea6d5a294)), closes [#2896](https://github.com/Agoric/agoric-sdk/issues/2896) [#2896](https://github.com/Agoric/agoric-sdk/issues/2896) [#2896](https://github.com/Agoric/agoric-sdk/issues/2896)
* settle REMOTE_STYLE name ([#2900](https://github.com/Agoric/agoric-sdk/issues/2900)) ([3dc6638](https://github.com/Agoric/agoric-sdk/commit/3dc66385b85cb3e8a1056b8d6e64cd3e448c041f))
* update types and implementation now that Far preserves them ([a4695c4](https://github.com/Agoric/agoric-sdk/commit/a4695c43a09abc92a20c12104cfbfefb4cae2ff2))
* **swingset:** when a static vat dies, tolerate lack of next-of-kin ([215dfb9](https://github.com/Agoric/agoric-sdk/commit/215dfb95cbe90767df9740aa80174b9d0e23921b))


### Features

* load virtual objects when accessed, not when deserialized ([5e659e6](https://github.com/Agoric/agoric-sdk/commit/5e659e6d85061dfd39a3ac7fb8e2d259ac78458e))
* **swingset:** add WeakRef tracking to liveslots ([6309e5f](https://github.com/Agoric/agoric-sdk/commit/6309e5fcc60503610381ea1cb4b906beb8e8e4fc)), closes [#2664](https://github.com/Agoric/agoric-sdk/issues/2664) [#2660](https://github.com/Agoric/agoric-sdk/issues/2660)
* implement the comms vat driver for testing the comms vat ([6793925](https://github.com/Agoric/agoric-sdk/commit/67939254c442befe08e7733cf8677d71e1777af1))
* keep all comms vat state in a persistent store ([51d7204](https://github.com/Agoric/agoric-sdk/commit/51d72040d8409d9b9be117f8101164fe97b99044))
* keep persistent comms vat state in the vatstore ([c55401b](https://github.com/Agoric/agoric-sdk/commit/c55401b7452a04d6cf58abe9a70f541daf9c034a))
* refcount-based promise GC in the comms vat ([209b034](https://github.com/Agoric/agoric-sdk/commit/209b034f196d46f5d6b499f8b0bf32dbddca1114))
* support promise retirement in comms vat ([a9b826f](https://github.com/Agoric/agoric-sdk/commit/a9b826f34ed5a6ea6e1a77acf7cfb491648fd058))





## [0.16.4](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.16.3...@agoric/swingset-vat@0.16.4) (2021-04-22)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.16.3](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.16.2...@agoric/swingset-vat@0.16.3) (2021-04-18)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.16.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.16.1...@agoric/swingset-vat@0.16.2) (2021-04-16)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.16.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.16.0...@agoric/swingset-vat@0.16.1) (2021-04-14)

**Note:** Version bump only for package @agoric/swingset-vat





# [0.16.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.15.1...@agoric/swingset-vat@0.16.0) (2021-04-13)


### Bug Fixes

* **network:** append the connection instance to the full localAddr ([ebd5963](https://github.com/Agoric/agoric-sdk/commit/ebd5963a2550907ea3966239327f02fb67ee5095))
* fully implement onInbound for unique connection ID ([421b9d4](https://github.com/Agoric/agoric-sdk/commit/421b9d432e26670f223518acbaf7d9bd55d63ca3))
* honour logging sent exceptions with DEBUG=SwingSet:ls ([db9b46a](https://github.com/Agoric/agoric-sdk/commit/db9b46af0a01eac00941f8c902ceedfb3a9938f6))


### Features

* **network:** allow onInstantiate to augment localAddress ([9cfc2fd](https://github.com/Agoric/agoric-sdk/commit/9cfc2fd58e9bd9076d4dc91af46b65e4c5729e54))





## [0.15.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.15.0...@agoric/swingset-vat@0.15.1) (2021-04-07)

**Note:** Version bump only for package @agoric/swingset-vat





# [0.15.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.14.0...@agoric/swingset-vat@0.15.0) (2021-04-06)


### Bug Fixes

* update to ses 0.12.7, ses-ava 0.1.1 ([#2820](https://github.com/Agoric/agoric-sdk/issues/2820)) ([6d81775](https://github.com/Agoric/agoric-sdk/commit/6d81775715bc80e6033d75cb65edbfb1452b1608))
* use SWINGSET_WORKER_TYPE to avoid WORKER_TYPE ambiguity ([c4616f1](https://github.com/Agoric/agoric-sdk/commit/c4616f1db0f2668eef5dbb97e30800d4e9caf3a0))
* **swingset:** path -> paths typo in require.resolve options ([58a0d0a](https://github.com/Agoric/agoric-sdk/commit/58a0d0a822a2d370d0d93af49a3644855adda729))
* update to depend on ses 0.12.5 ([#2718](https://github.com/Agoric/agoric-sdk/issues/2718)) ([08dbe0d](https://github.com/Agoric/agoric-sdk/commit/08dbe0db5ce06944dc92c710865e441a60b31b5b))
* use ses-ava in SwingSet where possible ([#2709](https://github.com/Agoric/agoric-sdk/issues/2709)) ([85b674e](https://github.com/Agoric/agoric-sdk/commit/85b674e7942443219fa9828841cc7bd8ef909b47))


### Features

* **swingset:** boot xsnap workers from snapshot ([2476e6f](https://github.com/Agoric/agoric-sdk/commit/2476e6f0e65ef35917a2ee11603376887fc88ab3))
* **swingset:** config for xs-worker vs. local default ([973b403](https://github.com/Agoric/agoric-sdk/commit/973b4039056a42fc1f5004b48af4e9fbcafb71aa))
* **swingset:** provide name to xsnap via managerOptions ([78b428d](https://github.com/Agoric/agoric-sdk/commit/78b428df4984d855a6eb2e0007d5dd2a17839abf))





# [0.14.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.13.0...@agoric/swingset-vat@0.14.0) (2021-03-24)


### Bug Fixes

* **swingset:** add dummy dispatch.dropExports to liveslots/comms/managers ([5108ad6](https://github.com/Agoric/agoric-sdk/commit/5108ad61459d0ac885489959586b0afe3c49ff71)), closes [#2653](https://github.com/Agoric/agoric-sdk/issues/2653)
* correct minor found by typechecking ([342c851](https://github.com/Agoric/agoric-sdk/commit/342c851609bac5de64c3a4cbe1e05a246fb2abcf))
* remove use of Data() from all packages ([540d917](https://github.com/Agoric/agoric-sdk/commit/540d917b20ae74e44752210524f6ffcb27708892)), closes [#2018](https://github.com/Agoric/agoric-sdk/issues/2018)
* rename crankStats -> meterUsage ([e0fa380](https://github.com/Agoric/agoric-sdk/commit/e0fa380220a9b0bbc555e55c1d6481c9e48add9b))
* use WeakSet for disavowals, improve comments, tidy vatPowers ([f9b5133](https://github.com/Agoric/agoric-sdk/commit/f9b5133ba48f389af0ecd9c20db9d0447e3db32d))
* **swingset:** add vatOptions.enableDisavow, dummy vatPowers.disavow ([4f43a5c](https://github.com/Agoric/agoric-sdk/commit/4f43a5cb62c838b25a5c59f178b902467da94fb9)), closes [#2635](https://github.com/Agoric/agoric-sdk/issues/2635)
* **swingset:** partially implement syscall.dropImports and disavow ([2490de5](https://github.com/Agoric/agoric-sdk/commit/2490de58643ffdc7e40f77294829ea7ed04e42ee)), closes [#2646](https://github.com/Agoric/agoric-sdk/issues/2646) [#2635](https://github.com/Agoric/agoric-sdk/issues/2635) [#2636](https://github.com/Agoric/agoric-sdk/issues/2636)


### Features

* add message sequence number to comms protocol ([d58cfa4](https://github.com/Agoric/agoric-sdk/commit/d58cfa416ad3b8ad3d5cef4c4616c1557a8efd6c))
* **SwingSet:** track the meter usage in deliverResults[2] ([c1a2388](https://github.com/Agoric/agoric-sdk/commit/c1a23887ca016007ff5ab38f77b8d9f560ce43a8))
* introduce slogCallbacks for the host to handle slog calls ([e2eb92e](https://github.com/Agoric/agoric-sdk/commit/e2eb92e1833b0623045b25b8de7a971cc8c9eba4))





# [0.13.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.12.1...@agoric/swingset-vat@0.13.0) (2021-03-16)


### Bug Fixes

* make separate 'test:xs' target, remove XS from 'test' target ([b9c1a69](https://github.com/Agoric/agoric-sdk/commit/b9c1a6987093fc8e09e8aba7acd2a1618413bac8)), closes [#2647](https://github.com/Agoric/agoric-sdk/issues/2647)
* **avaXS:** notDeepEqual confused false with throwing ([a1b7460](https://github.com/Agoric/agoric-sdk/commit/a1b74604a63b89dc499e58e72b8425effae0b809))
* **swingset:** add exit/vatstore syscalls to non-local vat workers ([35fceb1](https://github.com/Agoric/agoric-sdk/commit/35fceb1a74b4f659d18ff3d7d6e28660757c9fa6))
* **swingset:** allow Symbol.asyncIterator as a method name ([7947be7](https://github.com/Agoric/agoric-sdk/commit/7947be7803a3a3848079b271314c587508a3e5db)), closes [#2481](https://github.com/Agoric/agoric-sdk/issues/2481) [#2619](https://github.com/Agoric/agoric-sdk/issues/2619)
* **swingset:** more Far/Data on the network vat ([ce82afc](https://github.com/Agoric/agoric-sdk/commit/ce82afc47a4a135cbc71478ad0d1836ad79a21f0))
* **swingset:** remove Far/Remotable/getInterfaceOf from vatPowers ([c19a941](https://github.com/Agoric/agoric-sdk/commit/c19a9417ec995425eb67c8a2080b1b0e660420ef)), closes [#2637](https://github.com/Agoric/agoric-sdk/issues/2637)
* bug [#2533](https://github.com/Agoric/agoric-sdk/issues/2533), problem deleting virtual objects ([3645430](https://github.com/Agoric/agoric-sdk/commit/3645430e11c8e38d4deac88bf14e60f4561b2441))
* eliminate redundant resolves in comms ([86057fc](https://github.com/Agoric/agoric-sdk/commit/86057fc807f769e947ec4e45a0abed76fa6ff481))
* fake needs to be more real to work outside SwingSet unit tests ([9871903](https://github.com/Agoric/agoric-sdk/commit/9871903a34899f2852e831aab4d1dadb2b6ae703))
* remove resolveToRemote plumbing for clist-outbound.js ([caa367d](https://github.com/Agoric/agoric-sdk/commit/caa367d9ca355feb82b79928cde8eb92b4c093bf))
* weaken timer wakers to ERefs ([dda396f](https://github.com/Agoric/agoric-sdk/commit/dda396fbef9c407cf5c151ebdb783954c678ee08))
* **slogger:** do not harden the data being recorded ([e75ef53](https://github.com/Agoric/agoric-sdk/commit/e75ef53f726c7e44eec4ad8cd7718471d03c326e)), closes [#2517](https://github.com/Agoric/agoric-sdk/issues/2517)
* **xs-worker:** handle bigint in testLog a la kernel.js ([b362d8b](https://github.com/Agoric/agoric-sdk/commit/b362d8b66562bd63690b6d27483fc5fa12c22bd6))


### Features

* **SwingSet:** direct liveslots errors to a different console ([9eec3e3](https://github.com/Agoric/agoric-sdk/commit/9eec3e31d85da9467b5bfda69851c11b817e8611))
* declarative environments import for SwingSet, zoe tests ([#2580](https://github.com/Agoric/agoric-sdk/issues/2580)) ([bb0e7d6](https://github.com/Agoric/agoric-sdk/commit/bb0e7d604a9d789f9df0c6863e79a039f3b2f052))
* enable comms starting ID to be configurable in comms vats ([6c0b4d8](https://github.com/Agoric/agoric-sdk/commit/6c0b4d8e9b2e75931351b67390e0aebc9c90a0e9))
* implement a mock virtual object manager to support unit tests outside SwingSet ([d4f5025](https://github.com/Agoric/agoric-sdk/commit/d4f50257e1b7fb6812590c9cf806279ec518841b))
* push metrics from autobench ([3efc212](https://github.com/Agoric/agoric-sdk/commit/3efc21206ab6693abe94a4b7d2946b50e29983a9))





## [0.12.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.12.0...@agoric/swingset-vat@0.12.1) (2021-02-22)


### Bug Fixes

* protect testLog against BigInts ([60c4684](https://github.com/Agoric/agoric-sdk/commit/60c468477de3c24dbf39866e010f3ea22cbb195a))





# [0.12.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.11.0...@agoric/swingset-vat@0.12.0) (2021-02-16)


### Bug Fixes

* cleanups and simplifications ([1fe4eae](https://github.com/Agoric/agoric-sdk/commit/1fe4eae27cbe6e97b5f905d921d3e72d167cd108))
* Correlate sent errors with received errors ([73b9cfd](https://github.com/Agoric/agoric-sdk/commit/73b9cfd33cf7842bdc105a79592028649cb1c92a))
* exercise callNow in local-worker case ([c3c489e](https://github.com/Agoric/agoric-sdk/commit/c3c489e62867a86d8c9e2e66812eb55e7295c8ec)), closes [#1617](https://github.com/Agoric/agoric-sdk/issues/1617)
* Far and Remotable do unverified local marking rather than WeakMap ([#2361](https://github.com/Agoric/agoric-sdk/issues/2361)) ([ab59ab7](https://github.com/Agoric/agoric-sdk/commit/ab59ab779341b9740827b7c4cca4680e7b7212b2))
* hush "replaying transcripts" message during swingset startup ([#2394](https://github.com/Agoric/agoric-sdk/issues/2394)) ([9309dd9](https://github.com/Agoric/agoric-sdk/commit/9309dd99f68d17df7ca54ef561a9e6e383e1eb0e)), closes [#2277](https://github.com/Agoric/agoric-sdk/issues/2277)
* improve test-worker.js to assert promise results are correct ([73487b1](https://github.com/Agoric/agoric-sdk/commit/73487b12bbb656cd3809fc7f17c7b85f20f6e4ef)), closes [#1778](https://github.com/Agoric/agoric-sdk/issues/1778)
* link all the errors ([6ea7588](https://github.com/Agoric/agoric-sdk/commit/6ea75880ce0ac56ebf1e2187593f42010f5aa929))
* remove crankNumber from transcript entries ([#2429](https://github.com/Agoric/agoric-sdk/issues/2429)) ([d7886c0](https://github.com/Agoric/agoric-sdk/commit/d7886c08e81d64005ca9e9aeaea228ea49bc995f)), closes [#2400](https://github.com/Agoric/agoric-sdk/issues/2400) [#2428](https://github.com/Agoric/agoric-sdk/issues/2428)
* removed another q ([8e20245](https://github.com/Agoric/agoric-sdk/commit/8e202455604a1a5ec1e500ea8b0de05a7ef87d51))
* review comments ([17d7df6](https://github.com/Agoric/agoric-sdk/commit/17d7df6ee06eb5c340500bb5582f985c2993ab19))
* review comments ([7db7e5c](https://github.com/Agoric/agoric-sdk/commit/7db7e5c4c569dfedff8d748dd58893218b0a2458))
* take advantage of `/.../` being stripped from stack traces ([7acacc0](https://github.com/Agoric/agoric-sdk/commit/7acacc0d6ac06c37065ce984cc9147c945c572e5))
* use assert rather than FooError constructors ([f860c5b](https://github.com/Agoric/agoric-sdk/commit/f860c5bf5add165a08cb5bd543502857c3f57998))
* **kernel:** don't lose managerType ([37d169e](https://github.com/Agoric/agoric-sdk/commit/37d169ea3ae89d68c009065dedf886e6f786eb77))
* **swingset:** implement replayTranscript for all vat types ([7fde6a4](https://github.com/Agoric/agoric-sdk/commit/7fde6a46dbc392e61dc987f967303cf0884a230f))
* **swingset:** loadVat.js: properly wait for static vats to be ready ([ca4188b](https://github.com/Agoric/agoric-sdk/commit/ca4188b621f6fc175f682cc227cc3131dd1043f5)), closes [#2213](https://github.com/Agoric/agoric-sdk/issues/2213)
* **swingset:** test-worker.js: disable XS test until xsnap is ready ([61b2567](https://github.com/Agoric/agoric-sdk/commit/61b25674cb2493330f3e80eee3de870b8484d9cb))
* **xs-worker:** restore xs vat manager test to working order ([9274082](https://github.com/Agoric/agoric-sdk/commit/92740823d8be398c458fc102b889a4d0baf66de0)), closes [TypeError#2](https://github.com/TypeError/issues/2)
* tolerate symbols as property names ([#2094](https://github.com/Agoric/agoric-sdk/issues/2094)) ([15022fe](https://github.com/Agoric/agoric-sdk/commit/15022fe7f3fd3d1fc67687f3b010968725c30a7e))


### Features

* use xsnap worker CPU meter and start reporting consumption ([62e0d5a](https://github.com/Agoric/agoric-sdk/commit/62e0d5a3b5ff32bd79567bab8fa1b63eb7f9134a))
* vat-side promise ID retirement ([94e0078](https://github.com/Agoric/agoric-sdk/commit/94e0078673ff15e47c2fcf32f472d27c416a1cd8))
* **swingset:** defaultManagerType option in makeSwingsetController ([#2266](https://github.com/Agoric/agoric-sdk/issues/2266)) ([b57f08f](https://github.com/Agoric/agoric-sdk/commit/b57f08f3514e052126a758f949acb5db3cc5a32d)), closes [#2260](https://github.com/Agoric/agoric-sdk/issues/2260)
* **swingset:** xsnap vat worker ([#2225](https://github.com/Agoric/agoric-sdk/issues/2225)) ([50c8548](https://github.com/Agoric/agoric-sdk/commit/50c8548e4d610e1e32537bc155e4c58d917cd6df)), closes [#2216](https://github.com/Agoric/agoric-sdk/issues/2216) [#2202](https://github.com/Agoric/agoric-sdk/issues/2202)
* add a notifier to the timerService ([#2143](https://github.com/Agoric/agoric-sdk/issues/2143)) ([3cb4606](https://github.com/Agoric/agoric-sdk/commit/3cb46063080dd4fac27507ad0062e54dbf82eda4))
* finish support for notifying multiple promises at once ([83c6c33](https://github.com/Agoric/agoric-sdk/commit/83c6c339f8ce31e8f8066e013a8f4bc5049cf6e2))
* pluralize `resolve` syscall ([6276286](https://github.com/Agoric/agoric-sdk/commit/6276286b5553f13d3cb267c8015f83921a6caf9d))
* promise resolution notification refactoring ([4ffb911](https://github.com/Agoric/agoric-sdk/commit/4ffb91147dbdae971111d7f2fa1e5c9cdc1ae578))
* refactor notification and subscription ([dd5f7f7](https://github.com/Agoric/agoric-sdk/commit/dd5f7f7fc5b6ae7f8bee4f123821d92a26581af4))
* retire C-list entries for resolved promises ([13f96aa](https://github.com/Agoric/agoric-sdk/commit/13f96aa2b15ec01509d6c594c61d9b3c15109997))





# [0.11.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.10.0...@agoric/swingset-vat@0.11.0) (2020-12-10)


### Features

* **import-bundle:** Preliminary support Endo zip hex bundle format ([#1983](https://github.com/Agoric/agoric-sdk/issues/1983)) ([983681b](https://github.com/Agoric/agoric-sdk/commit/983681bfc4bf512b6bd90806ed9220cd4fefc13c))
* The Slogulator Mk I ([42c5fdc](https://github.com/Agoric/agoric-sdk/commit/42c5fdcb78aa058a72db96adce19e8b8e1b7eba7))





# [0.10.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.10.0-dev.0...@agoric/swingset-vat@0.10.0) (2020-11-07)


### Bug Fixes

* add liveslots-provided globals to vat Compartments ([3c79d51](https://github.com/Agoric/agoric-sdk/commit/3c79d516b7b3adfbe0f02ff809290acbc9079d44)), closes [#455](https://github.com/Agoric/agoric-sdk/issues/455) [#1846](https://github.com/Agoric/agoric-sdk/issues/1846) [#1867](https://github.com/Agoric/agoric-sdk/issues/1867)
* add stubs for GC tools (no-op on Node v12) ([7ecc184](https://github.com/Agoric/agoric-sdk/commit/7ecc1845c4f364660e66a42c5745d6d7225b76b6)), closes [#1872](https://github.com/Agoric/agoric-sdk/issues/1872) [#1925](https://github.com/Agoric/agoric-sdk/issues/1925)
* add vatDecRef to kernel, offer to liveslots ([#1926](https://github.com/Agoric/agoric-sdk/issues/1926)) ([527b44a](https://github.com/Agoric/agoric-sdk/commit/527b44a934937c71d18a0a702758132b5b77e1ed)), closes [#1872](https://github.com/Agoric/agoric-sdk/issues/1872)
* correct oversights & editing errors in virtual object code ([581fb91](https://github.com/Agoric/agoric-sdk/commit/581fb915486238a785130a2d4c2141539b3b2e49))
* further cleanup based on reviews ([2e74cc7](https://github.com/Agoric/agoric-sdk/commit/2e74cc72ce1c898b24c1a2613d7864d97fe383c2))
* more tests and further refinements ([72f9624](https://github.com/Agoric/agoric-sdk/commit/72f9624b0809fe10d6023ac5591c01acb2e3bdfe))
* refactor liveSlots so it could provide vat globals ([165205f](https://github.com/Agoric/agoric-sdk/commit/165205f5480eed0374627b72e41248ee085b9771)), closes [#1867](https://github.com/Agoric/agoric-sdk/issues/1867)
* remove unused 'state' arg from makeLiveslots() ([#1893](https://github.com/Agoric/agoric-sdk/issues/1893)) ([c2f7910](https://github.com/Agoric/agoric-sdk/commit/c2f79101e6e07b8afe3eadb906d5744b331d75e6))
* rework virtual objects implementation to use revised API design ([4c4c1c9](https://github.com/Agoric/agoric-sdk/commit/4c4c1c93f862b3aea990c7c7d556b7c6b949448d))
* track initializations in progress with a WeakSet ([f06f0fe](https://github.com/Agoric/agoric-sdk/commit/f06f0fef34747c42f1c59b39907d2a8ee4642e25))
* various cleanups and simplifications in virtualObjectManager, enable cache size as config param ([d564817](https://github.com/Agoric/agoric-sdk/commit/d564817d69cdabd7e52b41d95a1bdf0f987d521a))
* WeakRef taming follows taming pattern ([#1931](https://github.com/Agoric/agoric-sdk/issues/1931)) ([3949dfb](https://github.com/Agoric/agoric-sdk/commit/3949dfbc6284e40f69f7ceff21ed9a414dcdcbd4))


### Features

* **assert:** Thread stack traces to console, add entangled assert ([#1884](https://github.com/Agoric/agoric-sdk/issues/1884)) ([5d4f35f](https://github.com/Agoric/agoric-sdk/commit/5d4f35f901f2ca40a2a4d66dab980a5fe8e575f4))
* implement virtual objects kept in vat secondary storage ([9f4ae1a](https://github.com/Agoric/agoric-sdk/commit/9f4ae1a4ecda4245291f846149bab6c95c96634c))





# [0.10.0-dev.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.9.0...@agoric/swingset-vat@0.10.0-dev.0) (2020-10-19)


### Features

* add vatstorage syscalls to kernel ([90ef974](https://github.com/Agoric/agoric-sdk/commit/90ef974eed85bcb97126c45652e785ac243b9894))





# [0.9.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.8.1-dev.2...@agoric/swingset-vat@0.9.0) (2020-10-11)


### Bug Fixes

* add netstring encode/decode/stream library ([fd1da9e](https://github.com/Agoric/agoric-sdk/commit/fd1da9e94ff64f941c5f667e124f55ef27d03fb6)), closes [#1797](https://github.com/Agoric/agoric-sdk/issues/1797) [#1807](https://github.com/Agoric/agoric-sdk/issues/1807)
* change encoders/decoders for kernel-worker protocol endpoints ([8eb13fa](https://github.com/Agoric/agoric-sdk/commit/8eb13fa4940dbd4574e15bbcd14adcc812520b27))
* clean up some debug log messages for consistency ([56a0763](https://github.com/Agoric/agoric-sdk/commit/56a076320593f23fcb65cd118f0481ef40898a6a))
* clean up worker subprocess spawning ([afeced8](https://github.com/Agoric/agoric-sdk/commit/afeced85a7f3523aed3655c3d498ecdc9314ef02)), closes [#1777](https://github.com/Agoric/agoric-sdk/issues/1777)
* handle syscallResult and deliveryResult consistently among workers ([9e6e31a](https://github.com/Agoric/agoric-sdk/commit/9e6e31ac55521893b6fdf31785bb901345ed46af)), closes [#1775](https://github.com/Agoric/agoric-sdk/issues/1775)
* have liveSlots reject Promise arguments in D() invocations ([#1803](https://github.com/Agoric/agoric-sdk/issues/1803)) ([cdcf99d](https://github.com/Agoric/agoric-sdk/commit/cdcf99dd3e510a4f79bf55a823b62c2070038685)), closes [#1358](https://github.com/Agoric/agoric-sdk/issues/1358)
* improved error message when eventual send target is undefined ([#1847](https://github.com/Agoric/agoric-sdk/issues/1847)) ([f33d30e](https://github.com/Agoric/agoric-sdk/commit/f33d30e46eeb209f039e81a92350c06611cc45a1))
* loadVat should accept managerType= in options ([e9838f1](https://github.com/Agoric/agoric-sdk/commit/e9838f13853baa2f1c63d78dde0ca04bba688196))
* new 'worker-protocol' module to do Array-to-Buffer conversion ([e23b7bb](https://github.com/Agoric/agoric-sdk/commit/e23b7bb40e20bacf7f64c627333918e7d5137560))
* pass testLog to all vatWorkers ([29bc81a](https://github.com/Agoric/agoric-sdk/commit/29bc81a46d057532f51c37bed081d850cf7f31db)), closes [#1776](https://github.com/Agoric/agoric-sdk/issues/1776)
* rename netstring exports, clean up object modes ([e2bbaa2](https://github.com/Agoric/agoric-sdk/commit/e2bbaa25c53fd37bc26cd2d5d9f01710b0e06243))
* stop using netstring-stream ([6ac996c](https://github.com/Agoric/agoric-sdk/commit/6ac996c00b876bac89ba99677bc5b66502506f4b))
* tweaks from review comments ([bccad6b](https://github.com/Agoric/agoric-sdk/commit/bccad6b6ae7997dd60425cbba30c993eb1378666))
* update @agoric/store types and imports ([9e3493a](https://github.com/Agoric/agoric-sdk/commit/9e3493ad4d8c0a6a9230ad6a4c22a3254a867115))
* **swingset:** add 'slogFile' option to write slog to a file ([f97ef41](https://github.com/Agoric/agoric-sdk/commit/f97ef4152dc2074b82823a9ff8595e4b9a04395c))


### Features

* accept 'description' in vat creation options, pass to slog ([cb2d73b](https://github.com/Agoric/agoric-sdk/commit/cb2d73b7b1b5e63d4de611d3fec6dc381e38e3fc))
* overhaul kernel initialization and startup ([23c3f9d](https://github.com/Agoric/agoric-sdk/commit/23c3f9df56940230e21a16b4861f40197192fdea))
* revamp vat termination API ([aa5b93c](https://github.com/Agoric/agoric-sdk/commit/aa5b93c7ea761bf805206c71bb16e586267db74d))





## [0.8.1-dev.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.8.1-dev.1...@agoric/swingset-vat@0.8.1-dev.2) (2020-09-18)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.8.1-dev.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.8.1-dev.0...@agoric/swingset-vat@0.8.1-dev.1) (2020-09-18)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.8.1-dev.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.8.0...@agoric/swingset-vat@0.8.1-dev.0) (2020-09-18)


### Bug Fixes

* restore deleted comments ([9ed1f7d](https://github.com/Agoric/agoric-sdk/commit/9ed1f7d23aca6287194454f500e6238ad6f1c504))





# [0.8.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.7.1...@agoric/swingset-vat@0.8.0) (2020-09-16)


### Bug Fixes

* add TODO unimplemented for liveSlots synthetic presences ([6089e71](https://github.com/Agoric/agoric-sdk/commit/6089e71aaa48867625c19d2f64c6e5b29880b7ad))
* allow local Presences to receive deliveries as well ([93c8933](https://github.com/Agoric/agoric-sdk/commit/93c8933b5c2bdafec26b325e0d3fc6e88978d199)), closes [#1719](https://github.com/Agoric/agoric-sdk/issues/1719)
* eliminate unnecessary try/catch ([f3dc45c](https://github.com/Agoric/agoric-sdk/commit/f3dc45c63f0278e10ff1ee2eb08f3f7045b46d52))
* fix bug [#1491](https://github.com/Agoric/agoric-sdk/issues/1491), bogus hostStorage setup in test ([eb30411](https://github.com/Agoric/agoric-sdk/commit/eb304119f169f2c983ddcccc07376c32f1d05b91))
* fix bug [#1544](https://github.com/Agoric/agoric-sdk/issues/1544), type check store parameters instead of coercing ([6d9b4b8](https://github.com/Agoric/agoric-sdk/commit/6d9b4b80111318ecc36949d47f06514a5f4aec95))
* fix bug [#1609](https://github.com/Agoric/agoric-sdk/issues/1609), confusing error message on malformed vat code ([0c7e162](https://github.com/Agoric/agoric-sdk/commit/0c7e162eeca969d21fb8067e6b4690ae567e72e2))
* implement epochs and make tolerant of restarts ([1c786b8](https://github.com/Agoric/agoric-sdk/commit/1c786b861a445891d09df2f1a47d689d641a0c5f))
* make setState asynchronous ([73f9d40](https://github.com/Agoric/agoric-sdk/commit/73f9d40eb9e3f1b8a08355d0ba9d8835421093dd))
* pass through the entire marshal stack to the vat ([f93c26b](https://github.com/Agoric/agoric-sdk/commit/f93c26b602766c9d8e3eb15740236cf81b38387f))
* properly load and restore plugin device state ([6461fb8](https://github.com/Agoric/agoric-sdk/commit/6461fb84921fcb9f1b71b7e102229c336b04558e))
* reject promises in the arguments to syscall.callNow() ([7472661](https://github.com/Agoric/agoric-sdk/commit/747266162bc84378ebf5fc2290b4dbb45cd585fc)), closes [#1346](https://github.com/Agoric/agoric-sdk/issues/1346) [#1358](https://github.com/Agoric/agoric-sdk/issues/1358) [#1358](https://github.com/Agoric/agoric-sdk/issues/1358)
* remove ancient 'resolver' vatSlot type ([4adcd58](https://github.com/Agoric/agoric-sdk/commit/4adcd5877b8cbb1e852e6ef57f4b863b2096ac14))
* restoring most state, just need to isolate the plugin captp ([f92ee73](https://github.com/Agoric/agoric-sdk/commit/f92ee731afa69435b10b94cf4a483f25bed7a668))
* restrict plugins to be loaded only from ./plugins ([2ba608e](https://github.com/Agoric/agoric-sdk/commit/2ba608e46c6d8d33bdfca03a32af09f9cde3cc34))


### Features

* add local.plugin~.getPluginDir() ([94e7016](https://github.com/Agoric/agoric-sdk/commit/94e70164c1be5f68aaadfcf75223c441cde9f876))
* implement CapTP forwarding over a plugin device ([b4a1be8](https://github.com/Agoric/agoric-sdk/commit/b4a1be8f600d60191570a3bbf42bc4c82af47b06))
* properly terminate & clean up after failed vats ([cad2b2e](https://github.com/Agoric/agoric-sdk/commit/cad2b2e45aece7dbc150c40dea194a3fea5dbb69))





## [0.7.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.7.0...@agoric/swingset-vat@0.7.1) (2020-08-31)

**Note:** Version bump only for package @agoric/swingset-vat





# [0.7.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.6.0...@agoric/swingset-vat@0.7.0) (2020-08-31)


### Bug Fixes

* add "TODO unimplemented"s ([#1580](https://github.com/Agoric/agoric-sdk/issues/1580)) ([7795f93](https://github.com/Agoric/agoric-sdk/commit/7795f9302843a2c94d4a2f42cb22affe1e91d41d))
* better debugging of three-party handoff ([f4c6442](https://github.com/Agoric/agoric-sdk/commit/f4c6442211118e03b214e12ee15a10fd637b4a6e))
* clean up review issues ([9ad3b79](https://github.com/Agoric/agoric-sdk/commit/9ad3b79fe59055077ebdba5fcba762038f0f9fb2))
* cope with delivery failures after replay due to dead vats ([37dba42](https://github.com/Agoric/agoric-sdk/commit/37dba4263f8aa2d25da402cabdf5601130d7cd45))
* correct minor documentation error ([6856de0](https://github.com/Agoric/agoric-sdk/commit/6856de00d57ae70a21297fbc2aa3abcc5449a679))
* correct problems that benchmarking turned up ([30f3f87](https://github.com/Agoric/agoric-sdk/commit/30f3f87d4e734b96beaf192f25212dc7d575674d))
* don't modify the original 'config' object ([36496ab](https://github.com/Agoric/agoric-sdk/commit/36496ab03e756cc4b266f8fd623ffeabf97fa9bf)), closes [#1490](https://github.com/Agoric/agoric-sdk/issues/1490)
* downgrade ([f1f7a7b](https://github.com/Agoric/agoric-sdk/commit/f1f7a7b25c59b8ad3c9a5d32425d17d2a4c34bf4))
* excise @agoric/harden from the codebase ([eee6fe1](https://github.com/Agoric/agoric-sdk/commit/eee6fe1153730dec52841c9eb4c056a8c5438b0f))
* handle post-replay notifications to a dead vat ([4c0e343](https://github.com/Agoric/agoric-sdk/commit/4c0e343dc5dd8ed79240cfdd64e19b260ef8b401))
* handle relative paths more better ([e979475](https://github.com/Agoric/agoric-sdk/commit/e979475f4b5c77a1e084f82c814f866bf1a01457))
* minor: rearrange asserts in Remotable ([#1642](https://github.com/Agoric/agoric-sdk/issues/1642)) ([c43a08f](https://github.com/Agoric/agoric-sdk/commit/c43a08fb1733596172a7dc5ca89353d837033e23))
* reduce inconsistency among our linting rules ([#1492](https://github.com/Agoric/agoric-sdk/issues/1492)) ([b6b675e](https://github.com/Agoric/agoric-sdk/commit/b6b675e2de110e2af19cad784a66220cab21dacf))
* remove one layer of caching (the mailbox state) ([50b1d7e](https://github.com/Agoric/agoric-sdk/commit/50b1d7e65375c137c8d70093a3f115955d10dec7))
* use REMOTE_STYLE rather than 'presence' to prepare ([#1577](https://github.com/Agoric/agoric-sdk/issues/1577)) ([6b97ae8](https://github.com/Agoric/agoric-sdk/commit/6b97ae8670303631313a65d12393d7ad226b941d))
* **swingset:** add makeNetworkHost to vat-tp ([4520633](https://github.com/Agoric/agoric-sdk/commit/4520633b838bfae8a8fa3b82a0d0029b7fa75280)), closes [#259](https://github.com/Agoric/agoric-sdk/issues/259)
* **swingset:** check promise resolution table during comms.inbound ([e9d921a](https://github.com/Agoric/agoric-sdk/commit/e9d921a68ad567f66e6928cfbddfc0a1bf21e600)), closes [#1400](https://github.com/Agoric/agoric-sdk/issues/1400)
* **swingset:** createVatDynamically option to disable metering ([388af11](https://github.com/Agoric/agoric-sdk/commit/388af112c583d2bbc8fd2f4db218e637ffbeb259)), closes [#1307](https://github.com/Agoric/agoric-sdk/issues/1307)
* **swingset:** remove 'require' from vatEndowments ([4b584df](https://github.com/Agoric/agoric-sdk/commit/4b584df4131812562edf06c9b45b1816dde6e3eb)), closes [#1214](https://github.com/Agoric/agoric-sdk/issues/1214)
* **swingset:** replay dynamic vats properly ([7d631bc](https://github.com/Agoric/agoric-sdk/commit/7d631bccee1ff2cd38219ea2995298a1dbfeec0d)), closes [#1480](https://github.com/Agoric/agoric-sdk/issues/1480)
* **swingset:** rewrite comms, probably add third-party forwarding ([a5f3e04](https://github.com/Agoric/agoric-sdk/commit/a5f3e040b79813ab066fd98b1f093a8585c0c98f)), closes [#1535](https://github.com/Agoric/agoric-sdk/issues/1535) [#1404](https://github.com/Agoric/agoric-sdk/issues/1404)
* remove unnecessary types ([e242143](https://github.com/Agoric/agoric-sdk/commit/e24214342062f908ebee91a775c0427abc21e263))
* rename producePromise to makePromiseKit ([#1329](https://github.com/Agoric/agoric-sdk/issues/1329)) ([1d2925a](https://github.com/Agoric/agoric-sdk/commit/1d2925ad640cce7b419751027b44737bd46a6d59))
* send and receive Remotable tags ([#1628](https://github.com/Agoric/agoric-sdk/issues/1628)) ([1bae122](https://github.com/Agoric/agoric-sdk/commit/1bae1220c2c35f48f279cb3aeab6012bce8ddb5a))
* tweaks from PR review ([3c51b0f](https://github.com/Agoric/agoric-sdk/commit/3c51b0faca307fac957cf5f0106fe1973615eb68))
* **SwingSet:** reenable getInterfaceOf/Remotable vatPowers ([fd7a8ca](https://github.com/Agoric/agoric-sdk/commit/fd7a8cafa8b8544f4e47738247e1aaab3d980fe8))
* **SwingSet:** remove needless E argument from network functions ([5e5c919](https://github.com/Agoric/agoric-sdk/commit/5e5c9199b17a986bd3089720a8985e49a297c77c))


### Features

* allow pre-built kernelBundles for faster unit tests ([8c0cc8b](https://github.com/Agoric/agoric-sdk/commit/8c0cc8b64a11a50b37a26dd59f338df90ffb9244)), closes [#1643](https://github.com/Agoric/agoric-sdk/issues/1643)
* clean up after dead vats ([7fa2661](https://github.com/Agoric/agoric-sdk/commit/7fa2661eeddcad36609bf9d755ff1c5b07241f53))
* **swingset-vat:** add xs-worker managerType ([2db022d](https://github.com/Agoric/agoric-sdk/commit/2db022d966a416c9b765c18ed543dd5adb31cc6d))
* **xs-vat-worker:** locateWorkerBin finds built executable ([aecaeb1](https://github.com/Agoric/agoric-sdk/commit/aecaeb143668825183c5aa1b9a5c76d954b51501))
* phase 1 of vat termination: stop talking to or about the vat ([0b1aa20](https://github.com/Agoric/agoric-sdk/commit/0b1aa20630e9c33479d2c4c31a07723819598dab))
* Phase 1a of vat termination: reject promises from the dead vat ([80fc527](https://github.com/Agoric/agoric-sdk/commit/80fc5274f2ab295bf00026b30b7bd32d7508c475))
* Phase 2 of vat termination: throw away in memory remnants of dead vat ([9d6ff42](https://github.com/Agoric/agoric-sdk/commit/9d6ff42a081109281fc6e709d311f86d8094be61))
* support use of module references in swingset config sourceSpecs ([1c02653](https://github.com/Agoric/agoric-sdk/commit/1c0265353dcbb88fa5d2c7d80d53ebadee49936d))
* swingset-runner zoe demos to use pre-bundled zcf ([3df964a](https://github.com/Agoric/agoric-sdk/commit/3df964a10f61715fa2d72b1c408bb1903df61181))
* **swingset:** Add Node.js Worker (thread) -based VatManager ([61615a2](https://github.com/Agoric/agoric-sdk/commit/61615a2ea8de19aa4a1cea20960dcbab70db9f39)), closes [#1299](https://github.com/Agoric/agoric-sdk/issues/1299) [#1127](https://github.com/Agoric/agoric-sdk/issues/1127) [#1384](https://github.com/Agoric/agoric-sdk/issues/1384)
* **vattp:** allow specifying a console object for logging ([ae1a2a0](https://github.com/Agoric/agoric-sdk/commit/ae1a2a03bf2f823b5420b8777ec6c436cbb4b349))
* use debugName to differentiate sim-chain instances ([0efc33f](https://github.com/Agoric/agoric-sdk/commit/0efc33fafbeefeff587f94251dc3052179b17642))
* **swingset:** add subprocess+node -based VatManager ([184c912](https://github.com/Agoric/agoric-sdk/commit/184c9126d33a7f987d6d770df39416f0154e1045)), closes [#1374](https://github.com/Agoric/agoric-sdk/issues/1374)
* reintroduce anylogger as the console endowment ([98cd5cd](https://github.com/Agoric/agoric-sdk/commit/98cd5cd5c59e9121169bb8104b70c63ccc7f5f01))





# [0.6.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.5.2...@agoric/swingset-vat@0.6.0) (2020-06-30)


### Bug Fixes

* **swingset:** dynamic vats do not get control over their own metering ([c6e4118](https://github.com/Agoric/agoric-sdk/commit/c6e4118d0ef12a694586994e4c32b3569b6210b3))
* **swingset:** dynamic vats use named buildRootObject export ([605183b](https://github.com/Agoric/agoric-sdk/commit/605183b81bc02191c50d2bdea52bb99861d17055))
* **swingset:** raise meter FULL from 1e7 to 1e8 ([deb2c16](https://github.com/Agoric/agoric-sdk/commit/deb2c16fd6dd45e3e265fa450607ba4397b51505))
* delete c-list entries *before* notifying vats about promise resolutions ([7fb8a1f](https://github.com/Agoric/agoric-sdk/commit/7fb8a1f567cd32198e90e14eebaa6d5575479611))
* don't retire promises that resolve to data structures containing promises ([00098da](https://github.com/Agoric/agoric-sdk/commit/00098da1d9bf80565956d78fe592d78b0be9f2c1))
* Recipient-side resolved promise retirement ([65010cf](https://github.com/Agoric/agoric-sdk/commit/65010cf2a9b6a09e1e55ee63745a5cfc5ddf6cf5))
* Recipient-side resolved promise retirement ([dc0aec9](https://github.com/Agoric/agoric-sdk/commit/dc0aec99658ec0a6dac1d3e52d1f17fdfcd40d0d))
* Resolver-side resolved promise retirement ([401e86a](https://github.com/Agoric/agoric-sdk/commit/401e86a7eba8d018f7cb4284f86f473b94889ac8))
* Resolver-side resolved promise retirement ([7cb2984](https://github.com/Agoric/agoric-sdk/commit/7cb2984ee33e8779ad8713637f125d7b0aaf8bb7))
* update stat collection to account for promise retirement ([3f242dd](https://github.com/Agoric/agoric-sdk/commit/3f242dd2a80bf720830baaaafd4758a5888cd36c))


### Features

* **swingset:** activate metering of dynamic vats ([96eb63f](https://github.com/Agoric/agoric-sdk/commit/96eb63fbd641fdbddbd790c201af9420e9524937))
* **swingset:** allow vats to be defined by a buildRootObject export ([dce1fd4](https://github.com/Agoric/agoric-sdk/commit/dce1fd423f70b2830c77f238586cb58a43aab930))
* add stats collection facility to kernel ([1ea7bb7](https://github.com/Agoric/agoric-sdk/commit/1ea7bb77a3795a9ebadbe80f27a8e4cece3b3c9e))
* count number of times various stats variables are incremented and decremented ([129f02f](https://github.com/Agoric/agoric-sdk/commit/129f02fb3c5a44950fa0ab12a715fc2f18911c08))
* inbound network connection metadata negotiation ([a7ecd9d](https://github.com/Agoric/agoric-sdk/commit/a7ecd9d9a60ba2769b6865fb6c195b569245a260))
* kernel promise reference counting ([ba1ebc7](https://github.com/Agoric/agoric-sdk/commit/ba1ebc7b2561c6a4c856b16d4a24ba38a40d0d74))
* outbound connection metadata negotiation ([5dd2e63](https://github.com/Agoric/agoric-sdk/commit/5dd2e63b8c1fac9543bbb9f9e2f5d8e932efc34a))
* pass blockHeight and blockTime from all IBC events ([79bd316](https://github.com/Agoric/agoric-sdk/commit/79bd3160a3af232b183bcefb8b229fdbf6192c49))
* pass local and remote address to onOpen callback ([2297a08](https://github.com/Agoric/agoric-sdk/commit/2297a089a0fc576a4d958427292b2f174215ad3f))
* support value return from `bootstrap` and other exogenous messages ([a432606](https://github.com/Agoric/agoric-sdk/commit/a43260608412025991bcad3a48b20a486c3dbe15))





## [0.5.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.5.1...@agoric/swingset-vat@0.5.2) (2020-05-17)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.5.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.5.0...@agoric/swingset-vat@0.5.1) (2020-05-10)


### Bug Fixes

* rewrite liveslots use of HandledPromise, remove deliver() stall ([42c2193](https://github.com/Agoric/agoric-sdk/commit/42c2193ce62f527eb2dfa1b5bed4f8b32f2d452d))





# [0.5.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.4.2...@agoric/swingset-vat@0.5.0) (2020-05-04)


### Bug Fixes

* get the encouragement dIBC working ([6bb1337](https://github.com/Agoric/agoric-sdk/commit/6bb13377c94e25df79481a42c3f280b7f4da43ed))
* harmonise the docs with the implementation ([88d2a0a](https://github.com/Agoric/agoric-sdk/commit/88d2a0aeb5cb6ebbece7bebc090b1b6697fdb8e1))
* ibcports->ibcport ([efb9d95](https://github.com/Agoric/agoric-sdk/commit/efb9d95c8fc5b69e76e9dc52236ebea2f98ee50c))
* improve bridge and network implementation ([1fca476](https://github.com/Agoric/agoric-sdk/commit/1fca4762e7cb458d14499b6b533bc0e4889e3842))
* introduce sleep to help mitigate a relayer race condition ([c0014d3](https://github.com/Agoric/agoric-sdk/commit/c0014d3108f28c01d507da1c7553295a3fde6b06))
* lint... ([1db8eac](https://github.com/Agoric/agoric-sdk/commit/1db8eacd5fdb0e6d6ec6d2f93bd29e7c9291da30))
* message legibilization shouldn't choke on non-JSON-parseable messages ([4267c52](https://github.com/Agoric/agoric-sdk/commit/4267c523c578ab0cc99ab091a27b4ec75ac90015))
* more dIBC inbound work ([6653937](https://github.com/Agoric/agoric-sdk/commit/665393779540c580d57f798aa01c62855e7b5278))
* move "crank 0" commit to after initialized flag is set ([f57c755](https://github.com/Agoric/agoric-sdk/commit/f57c755f9a30fd2200da0a9de8992e0cc0f4b000))
* proper inbound IBC listening ([3988235](https://github.com/Agoric/agoric-sdk/commit/3988235312806711c1837f80788ddc42ae7713dd))
* reimplement crossover connections ([bf3bd2a](https://github.com/Agoric/agoric-sdk/commit/bf3bd2ad78440dad42935e4a30b50de56a77ceba))
* reject all sends when the connection is closed ([61b0975](https://github.com/Agoric/agoric-sdk/commit/61b09750c6c89f0097addd9ee068751bc4a55e56))
* rename host->peer, and implement basic Multiaddr ([ef89315](https://github.com/Agoric/agoric-sdk/commit/ef893151189ab99016910582a8d5ca3aa96c4fda))
* return packet acknowledgements ([4cf6f2f](https://github.com/Agoric/agoric-sdk/commit/4cf6f2f210466fa049361f9d7c115a706ec6ff49))
* return the correct crossover side for inbound ([dc285d7](https://github.com/Agoric/agoric-sdk/commit/dc285d7f80197bf88fcc5961fe758d9cb891d7b4))
* separate multiaddr from network ([f3d7dcb](https://github.com/Agoric/agoric-sdk/commit/f3d7dcb289b376c4083dd63b1b7f8502640a5dc6))
* swingset: remove unused 'inbound' device ([f096e3b](https://github.com/Agoric/agoric-sdk/commit/f096e3b5afa78175f897736c2cf7f68d86dceb12))
* update docs and metadata to require Node.js v12.16.1 or higher ([#938](https://github.com/Agoric/agoric-sdk/issues/938)) ([d4e5f74](https://github.com/Agoric/agoric-sdk/commit/d4e5f7447d7172f519b97ff83b53f29c281710e7)), closes [#837](https://github.com/Agoric/agoric-sdk/issues/837) [#937](https://github.com/Agoric/agoric-sdk/issues/937) [#837](https://github.com/Agoric/agoric-sdk/issues/837) [#35](https://github.com/Agoric/agoric-sdk/issues/35)
* update tests to account for kernel tracking crank number ([700802d](https://github.com/Agoric/agoric-sdk/commit/700802d39a14c020a3514f3a3a22840f9d97a0bf))
* use harden ([453552b](https://github.com/Agoric/agoric-sdk/commit/453552b85839b125e516207750a8df87c34e4d41))
* use the new (typed) harden package ([2eb1af0](https://github.com/Agoric/agoric-sdk/commit/2eb1af08fe3967629a3ce165752fd501a5c85a96))


### Features

* add crank number to kernel state ([75e5d53](https://github.com/Agoric/agoric-sdk/commit/75e5d53d36862e630b3ee8e9628d2237493eb8ae))
* add Presence, getInterfaceOf, deepCopyData to marshal ([aac1899](https://github.com/Agoric/agoric-sdk/commit/aac1899b6cefc4241af04911a92ffc50fbac3429))
* add the network vat to ag-solo ([d88062c](https://github.com/Agoric/agoric-sdk/commit/d88062c9d35a10afaab82728123ca3d71b7d5189))
* allow pure handlers by passing the handler back in ([acf4bcc](https://github.com/Agoric/agoric-sdk/commit/acf4bcc585bbd03986080331830f34413ea7486d))
* begin getting working with loopback peer ([7729e86](https://github.com/Agoric/agoric-sdk/commit/7729e869793196cbc2f937260c0a320665056784))
* end-to-end dIBC across chains ([151ff3f](https://github.com/Agoric/agoric-sdk/commit/151ff3f9e0c92972aa7a21a6f55c1898db85b820))
* finish network router and multiaddr implementation ([dc74469](https://github.com/Agoric/agoric-sdk/commit/dc74469462b8fdc0f1fdc47dc4a9922a891902bd))
* first pass at channel API ([f45f04e](https://github.com/Agoric/agoric-sdk/commit/f45f04e88f8dc236ca509529dd7d45265449715e))
* get 'ibc/*/ordered/echo' handler working ([2795c21](https://github.com/Agoric/agoric-sdk/commit/2795c214cae8ac44eb5d19eb1b1aa0c066a22ecd))
* implement channel host handler ([4e68f44](https://github.com/Agoric/agoric-sdk/commit/4e68f441b46d70dee481387ab96e88f1e0b69bfa))
* implement the "sendPacket" transaction ([063c5b5](https://github.com/Agoric/agoric-sdk/commit/063c5b5c266187bc327dde568090dabf2bbfde8d))
* implement the network vat ([0fcd783](https://github.com/Agoric/agoric-sdk/commit/0fcd783576ecfab5430d3d905a53f22b3e01e95f))
* Improved console log diagnostics ([465329d](https://github.com/Agoric/agoric-sdk/commit/465329d1d7f740e82fa46da24be370e2081fcb33))
* introduce vats/ibc.js handler ([cb511e7](https://github.com/Agoric/agoric-sdk/commit/cb511e74e797bedbcce1aac4193780ae7abc8cfc))
* swingset: add 'bridge' device ([4b07cdd](https://github.com/Agoric/agoric-sdk/commit/4b07cddf5db86b3ee886b0aeb1a4932e664bdc39)), closes [#860](https://github.com/Agoric/agoric-sdk/issues/860)
* swingset: add networking.md ([74b53d4](https://github.com/Agoric/agoric-sdk/commit/74b53d420e9bc84d3b5e11555283e659556ea4b0))
* Treat state resulting from kernel initialization as if it resulted from a crank ([4763c02](https://github.com/Agoric/agoric-sdk/commit/4763c024c0fcae4471f525b385eb71548344d9df))





## [0.4.2](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.4.2-alpha.0...@agoric/swingset-vat@0.4.2) (2020-04-13)

**Note:** Version bump only for package @agoric/swingset-vat





## [0.4.2-alpha.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.4.1...@agoric/swingset-vat@0.4.2-alpha.0) (2020-04-12)


### Bug Fixes

* liveslots use the returned promise rather than our own ([3135d9a](https://github.com/Agoric/agoric-sdk/commit/3135d9a14c0b9e773419c6882ad00fb285b27303))
* tweak log levels ([b0b1649](https://github.com/Agoric/agoric-sdk/commit/b0b1649423f7b950904604ba997ddb25e413fe08))





## [0.4.1](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.4.1-alpha.0...@agoric/swingset-vat@0.4.1) (2020-04-02)


### Bug Fixes

* make unhandledRejections log louder ([313adf0](https://github.com/Agoric/agoric-sdk/commit/313adf0b30ef2e6069573e1bb683bbb01411b175))





## [0.4.1-alpha.0](https://github.com/Agoric/agoric-sdk/compare/@agoric/swingset-vat@0.4.0...@agoric/swingset-vat@0.4.1-alpha.0) (2020-04-02)

**Note:** Version bump only for package @agoric/swingset-vat





# 0.4.0 (2020-03-26)


### Bug Fixes

* allow vats under SwingSet to unwrap their promises ([f2be5c7](https://github.com/Agoric/SwingSet/commit/f2be5c7806de93388e2641962539218313489fad))
* anachrophobia should crash hard ([42deaaf](https://github.com/Agoric/SwingSet/commit/42deaafc7082d42f5114134744e5fdd01cc93ad7)), closes [#68](https://github.com/Agoric/SwingSet/issues/68)
* first draft use collection equality ([6acbde7](https://github.com/Agoric/SwingSet/commit/6acbde71ec82101ec8da9eaafc729bab1fdd6df9))
* improve command device support ([c70b8a1](https://github.com/Agoric/SwingSet/commit/c70b8a10b04c5554b1a952daa584216227858bc5))
* input queuing, and use the block manager for fake-chain ([c1282c9](https://github.com/Agoric/SwingSet/commit/c1282c9e644fbea742846f96a80a06afe64664ba))
* let the caller handle dispatch rejections ([8a9761d](https://github.com/Agoric/SwingSet/commit/8a9761dcb49787a03bc302a1138a4e86a80ee360))
* make code clearer ([efc6b4a](https://github.com/Agoric/SwingSet/commit/efc6b4a369cc23813788f5626c61ec412e4e3f6a))
* make default log level for ag-chain-cosmos more compatible ([258e4c9](https://github.com/Agoric/SwingSet/commit/258e4c94746888f0392da19335cf7abc804c3b3a))
* remove 'Nat' from the set that SwingSet provides to kernel/vat code ([b4798d9](https://github.com/Agoric/SwingSet/commit/b4798d9e323c4cc16beca8c7f2547bce59334ae4))
* remove nondeterminism from ag-solo replay ([2855b34](https://github.com/Agoric/SwingSet/commit/2855b34158b71e7ffe0acd7680d2b3c218a5f0ca))
* secure the console and nestedEvaluate endowments ([ed13e80](https://github.com/Agoric/SwingSet/commit/ed13e8008628ee95cb1a5ee5cc5b8e9dd4640a32))
* **eventual-send:** Update the API throughout agoric-sdk ([97fc1e7](https://github.com/Agoric/SwingSet/commit/97fc1e748d8e3955b29baf0e04bfa788d56dad9f))
* **solo:** get repl working again ([a42cfec](https://github.com/Agoric/SwingSet/commit/a42cfec9c8c087c77ec6e09d5a24edfe0d215c02))
* **swingset:** controller: enforce withSES==true ([e4d9b04](https://github.com/Agoric/SwingSet/commit/e4d9b04847bc5cc913f67fa308ff223779a10286))
* **swingset:** disable all non-SES tests ([b481008](https://github.com/Agoric/SwingSet/commit/b48100890d881e2678d4842993c6dcc067043eba))
* stringify an inboundHandler Error better ([6f80429](https://github.com/Agoric/SwingSet/commit/6f804291f7a348cef40899963b15a6274005a7f6))
* symbols no longer passable ([7290a90](https://github.com/Agoric/SwingSet/commit/7290a90444f70d2a9a2f5c1e2782d18bea00039d))
* **metering:** refactor names and implementation ([f1410f9](https://github.com/Agoric/SwingSet/commit/f1410f91fbee61903e82a81368675eef4fa0b836))
* **SwingSet:** ensure the registerEndOfCrank doesn't allow sandbox escape ([053c56e](https://github.com/Agoric/SwingSet/commit/053c56e19e5a4ff4eba5a1b7550ccac7e6dab5d7))
* **SwingSet:** passing all tests ([341718b](https://github.com/Agoric/SwingSet/commit/341718be335e16b58aa5e648b51a731ea065c1d6))
* **SwingSet:** remove Nat from nested evaluation contexts too ([69088d1](https://github.com/Agoric/SwingSet/commit/69088d1c225a8234b2f39a0490309615b5d0a047))
* **SwingSet:** remove redundant ${e} ${e.message} ([9251375](https://github.com/Agoric/SwingSet/commit/92513753bb8ec8b3dd28318bb26c7c7a58df2ba7))
* **timer:** don't enforce advancement, just prevent moving backwards ([7a0a509](https://github.com/Agoric/SwingSet/commit/7a0a50916ee98b4aad1288b34e4b1cda9b456437)), closes [#328](https://github.com/Agoric/SwingSet/issues/328)


### Features

* use anylogger to allow flexible message dispatch ([be8abc8](https://github.com/Agoric/SwingSet/commit/be8abc8fb8bb684273b13a1732a2bf509a962253))
* **metering:** allow the metering vat to register refill functions ([ce077a3](https://github.com/Agoric/SwingSet/commit/ce077a38aec75a01621ea6a115e919ae607e3aeb))
* **nestedEvaluate:** support new moduleFormat ([deb8ee7](https://github.com/Agoric/SwingSet/commit/deb8ee73437cb86ef98c160239c931305fb370ad))
* **spawner:** implement basic metering ([8bd495c](https://github.com/Agoric/SwingSet/commit/8bd495ce64ab20a4f7e78999846afe1f9bce96a4))
* **SwingSet:** pass all tests with metering installed ([d2dbd2c](https://github.com/Agoric/SwingSet/commit/d2dbd2c17db613faa18ccfa5903fa0160f90b35e))
