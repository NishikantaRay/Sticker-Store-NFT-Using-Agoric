# Contributing

Thank you!

## Contact

We use github issues for all bug reports:
https://github.com/Agoric/agoric-sdk/issues Please add a [Zoe]
prefix to the title and Zoe tag to Zoe-related issues.

## Installing, Testing

You'll need Node.js version 11 or higher. 

* `git clone https://github.com/Agoric/agoric-sdk/`
* `cd agoric-sdk`
* `yarn install`
* `yarn build` (This *must* be done at the top level to build all of
  the packages)
* `cd packages/Zoe`
* `yarn test`

## Pull Requests

Before submitting a pull request, please:

* run `yarn test` within `packages/Zoe` and make sure all the unit
  tests pass (running `yarn test` at the top level will test all the
  monorepo packages, which can be a good integration test.)
* run `yarn run lint-fix` to reformat the code according to our
  `eslint` profile, and fix any complaints that it can't automatically
  correct

## Making a Release

* edit NEWS.md enumerating any user-visible changes. (If there are
  changelogs/ snippets, consolidate them to build the new NEWS
  entries, and then delete all the snippets.)
* make sure `yarn config set version-git-tag false` is the current
  setting
* `yarn version` (interactive) or `yarn version --major` or `yarn version --minor`
  * that changes `package.json`
  * and does NOT do a `git commit` and `git tag`
* `git add .`
* `git commit -m "bump version"`
* `git tag -a zoe-v$VERSION -m "zoe-v$VERSION"`
* `yarn publish --access public`
* `git push`
* `git push origin zoe-v$VERSION`

Then, once the release has been made, the packages dependent on Zoe
should be updated in a PR reviewed by the owners of the packages.
Those packages are:
* packages/agoric-cli (`packages/agoric-cli/template/contract/package.json`)
* packages/cosmic-swingset (`packages/cosmic-swingset/package.json`)

To test that that the Zoe update works (in the most basic sense) with cosmic-swingset, do:

1. Run `yarn install` from the workspace root
2. Run `yarn build` from the workspace root
3. ... Profit!


To test that the update works with agoric-cli, follow the instructions
for [Developing Agoric CLI](https://github.com/Agoric/agoric-sdk/tree/master/packages/agoric-cli#developing-agoric-cli).
