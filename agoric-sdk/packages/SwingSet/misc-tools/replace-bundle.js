#!/usr/bin/env node

import '@agoric/install-ses';
import process from 'process';
import { openSwingStore } from '@agoric/swing-store';
import bundleSource from '@agoric/bundle-source';

const log = console.log;

function usage() {
  log(`
Command line:
  replace-bundle.js BUNDLEORVATNAME STATEDIR SOURCEPATH
`);
}

function fail(message, printUsage) {
  if (message) {
    log(message);
  }
  if (printUsage) {
    usage();
  }
  process.exit(1);
}

async function run() {
  const argv = process.argv.slice(2);
  if (argv.length !== 3) {
    fail('wrong number of args', true);
  }

  let bundleName = argv.shift();
  let bundleBundle = true;
  const stateDBDir = argv.shift();
  const srcPath = argv.shift();

  const { kvStore, commit } = openSwingStore(stateDBDir);
  log(`will use ${srcPath} in ${stateDBDir} for ${bundleName}`);

  if (bundleName === 'kernel') {
    bundleName = 'kernelBundle';
  } else {
    const vatID = kvStore.get(`vat.name.${bundleName}`);
    if (vatID) {
      bundleName = `${vatID}.source`;
    }
  }
  if (bundleName === 'kernelBundle') {
    bundleBundle = false;
  }

  const oldBundleStr = kvStore.get(bundleName);
  log(`old bundle is ${oldBundleStr.length} bytes`);
  let bundle = await bundleSource(srcPath);
  if (bundleBundle) {
    bundle = { bundle };
  }
  const newBundleStr = JSON.stringify(bundle);
  log(`new bundle is ${newBundleStr.length} bytes`);
  kvStore.set(bundleName, newBundleStr);
  commit();
  log(`bundle ${bundleName} replaced`);
}

run().catch(console.error);
