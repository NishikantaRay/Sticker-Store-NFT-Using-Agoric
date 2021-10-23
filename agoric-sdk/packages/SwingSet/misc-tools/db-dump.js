import '@agoric/install-ses';
import process from 'process';
import { openSwingStore } from '@agoric/swing-store';

const log = console.log;

const out = process.stdout;
function p(str) {
  out.write(str);
  out.write('\n');
}

function usage() {
  log(`
Command line:
  db-dump.js STATEDIR

where STATEDIR is e.g. ~/.ag-chain-cosmos/data/ag-cosmos-chain-state
and contains data.mdb

Dumps the entire kerneldb to stdout, in the form of JSON lines [key, value]
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

function run() {
  const argv = process.argv.slice(2);
  if (argv.length !== 1) {
    fail('wrong number of args', true);
  }
  const stateDBDir = argv.shift();

  const { kvStore } = openSwingStore(stateDBDir);

  // we know all keys start with letters, so '@' is before all keys, and '{'
  // is after all keys
  for (const key of kvStore.getKeys(`@`, `{`)) {
    const value = kvStore.get(key);
    console.log(JSON.stringify([key, value]));
  }
}

run();
