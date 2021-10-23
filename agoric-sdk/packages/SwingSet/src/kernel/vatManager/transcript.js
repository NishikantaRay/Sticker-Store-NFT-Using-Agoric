import djson from '../djson.js';

export function requireIdentical(vatID, originalSyscall, newSyscall) {
  if (djson.stringify(originalSyscall) !== djson.stringify(newSyscall)) {
    console.log(`anachrophobia strikes vat ${vatID}`);
    console.log(`expected:`, djson.stringify(originalSyscall));
    console.log(`got     :`, djson.stringify(newSyscall));
    return new Error(`historical inaccuracy in replay of ${vatID}`);
  }
  return undefined;
}

export function makeTranscriptManager(
  vatKeeper,
  vatID,
  compareSyscalls = requireIdentical,
) {
  let weAreInReplay = false;
  let playbackSyscalls;
  let currentEntry;

  function startDispatch(d) {
    currentEntry = {
      d,
      syscalls: [],
    };
  }

  const gcSyscalls = new Set(['dropImports', 'retireImports', 'retireExports']);

  function addSyscall(d, response) {
    const type = d[0];
    if (gcSyscalls.has(type)) {
      return;
    }
    if (currentEntry) {
      currentEntry.syscalls.push({ d, response });
    }
  }

  function finishDispatch() {
    if (!weAreInReplay) {
      vatKeeper.addToTranscript(currentEntry);
    }
  }

  // replay

  function startReplay() {
    weAreInReplay = true;
  }

  function startReplayDelivery(syscalls) {
    playbackSyscalls = Array.from(syscalls);
  }

  function inReplay() {
    return weAreInReplay;
  }

  function finishReplay() {
    weAreInReplay = false;
  }

  let replayError;

  function simulateSyscall(newSyscall) {
    const type = newSyscall[0];
    if (gcSyscalls.has(type)) {
      return undefined;
    }
    const s = playbackSyscalls.shift();
    const newReplayError = compareSyscalls(vatID, s.d, newSyscall);
    if (newReplayError) {
      replayError = newReplayError;
      throw replayError;
    }
    return s.response;
  }

  function finishReplayDelivery() {
    if (playbackSyscalls.length !== 0) {
      console.log(`anachrophobia strikes vat ${vatID}`);
      console.log(
        `delivery completed with ${playbackSyscalls.length} expected syscalls remaining`,
      );
      for (const s of playbackSyscalls) {
        console.log(`expected:`, djson.stringify(s.d));
      }
      if (!replayError) {
        replayError = new Error(`historical inaccuracy in replay of ${vatID}`);
      }
      throw replayError;
    }
  }

  function checkReplayError() {
    if (replayError) {
      throw replayError;
    }
  }

  return harden({
    startDispatch,
    addSyscall,
    finishDispatch,
    startReplay,
    startReplayDelivery,
    finishReplay,
    simulateSyscall,
    finishReplayDelivery,
    checkReplayError,
    inReplay,
  });
}
