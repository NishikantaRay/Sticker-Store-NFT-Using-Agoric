#!/usr/bin/env node

// TODO Remove babel-standalone preinitialization
// https://github.com/endojs/endo/issues/768
import '@agoric/babel-standalone';
import '@agoric/install-ses';
import process from 'process';
import repl from 'repl';
import util from 'util';
import { loadBasedir, buildVatController } from '../src/index.js';
import { buildLoopbox } from '../src/devices/loopbox.js';

function deepLog(item) {
  console.log(util.inspect(item, false, null, true));
}

async function main() {
  const argv = process.argv.splice(2);
  let withSES = true;
  if (argv[0] === '--no-ses') {
    withSES = false;
    argv.shift();
  }
  const command = argv.shift();
  if (command !== 'run' && command !== 'shell') {
    throw new Error(`use 'vat run' or 'vat shell', not 'vat ${command}'`);
  }
  const basedir =
    argv[0] === '--' || argv[0] === undefined ? '.' : argv.shift();
  const vatArgv = argv[0] === '--' ? argv.slice(1) : argv;

  const config = await loadBasedir(basedir);
  const { loopboxSrcPath, loopboxEndowments } = buildLoopbox('immediate');
  config.devices = [['loopbox', loopboxSrcPath, loopboxEndowments]];

  const controller = await buildVatController(config, withSES, vatArgv);
  if (command === 'run') {
    await controller.run();
    console.log('= vat finished');
  } else if (command === 'shell') {
    const r = repl.start({ prompt: 'vat> ', replMode: repl.REPL_MODE_STRICT });
    r.context.dump = () => {
      const d = controller.dump();
      console.log('Kernel Table:');
      deepLog(d.kernelTable);
      console.log('Promises:');
      deepLog(d.promises);
      console.log('Run Queue:');
      deepLog(d.runQueue);
    };
    r.context.dump2 = () => controller.dump();
    r.context.run = () => {
      console.log('run!');
      controller.run();
    };
    r.context.step = () => {
      console.log('step!');
      controller.step();
    };
  }
}

main();
