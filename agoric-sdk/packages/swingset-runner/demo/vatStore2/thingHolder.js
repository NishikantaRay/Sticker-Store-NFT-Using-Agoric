/* global makeKind makeVirtualScalarWeakMap */
import { E } from '@agoric/eventual-send';
import { Far } from '@agoric/marshal';

const p = console.log;

function build(name) {
  function makeThingInstance(state) {
    return {
      init(label, companion, companionName) {
        p(`${name}'s thing ${label}: initialize ${companionName}`);
        state.label = label;
        state.companion = companion;
        state.companionName = companionName;
        state.count = 0;
      },
      self: Far('thing', {
        echo(message) {
          state.count += 1;
          E(state.companion).say(message);
        },
        async changePartner(newCompanion) {
          state.count += 1;
          state.companion = newCompanion;
          const companionName = await E(newCompanion).getName();
          state.companionName = companionName;
          p(`${name}'s thing ${state.label}: changePartner ${companionName}`);
        },
        getLabel() {
          const label = state.label;
          p(`${name}'s thing ${label}: getLabel`);
          state.count += 1;
          return label;
        },
        report() {
          p(`${name}'s thing ${state.label} invoked ${state.count} times`);
        },
      }),
    };
  }

  const thingMaker = makeKind(makeThingInstance);
  let nextThingNumber = 0;

  const myThings = makeVirtualScalarWeakMap('thing'); // thing -> inquiry count

  return Far('root', {
    async introduce(other) {
      const otherName = await E(other).getName();
      const thing = thingMaker(`thing-${nextThingNumber}`, other, otherName);
      nextThingNumber += 1;
      myThings.init(thing, 0);
      return thing;
    },
    doYouHave(thing) {
      if (myThings.has(thing)) {
        const queryCount = myThings.get(thing) + 1;
        myThings.set(thing, queryCount);
        p(`${name}: ${queryCount} queries about ${thing.getLabel()}`);
        return true;
      } else {
        p(`${name}: query about unknown thing`);
        return false;
      }
    },
  });
}

export function buildRootObject(_vatPowers, vatParameters) {
  return build(vatParameters.name);
}
