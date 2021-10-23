// @ts-check
/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-extraneous-dependencies
import { test } from '@agoric/swingset-vat/tools/prepare-test-env-ava.js';

import { ALLOW_IMPLICIT_REMOTABLES, Far, passStyleOf } from '@agoric/marshal';
import {
  makeLegacyMap,
  makeLegacyWeakMap,
  makeScalarMap,
  makeScalarWeakMap,
} from '../src/index.js';
import '../src/types.js';

function check(t, mode, objMaker) {
  // Check the full API, and make sure object identity isn't a problem by
  // creating two potentially-similar things for use as keys.
  let s;
  if (mode === 'strong') {
    s = makeScalarMap('store1');
  } else if (mode === 'weak') {
    s = makeScalarWeakMap('store1');
  } else {
    throw Error(`unknown mode ${mode}`);
  }
  const k1 = objMaker(1);
  const k2 = objMaker(2);

  function checkEntries(entries) {
    if (mode === 'strong') {
      t.deepEqual(new Set(s.keys()), new Set(entries.map(([k, _v]) => k)));
      t.deepEqual(new Set(s.values()), new Set(entries.map(([_k, v]) => v)));
      t.deepEqual(new Set(s.entries()), new Set(entries));
    }
  }

  checkEntries([]);

  s.init(k1, 'one');
  t.truthy(s.has(k1));
  t.is(s.get(k1), 'one');
  t.falsy(s.has(k2));
  checkEntries([[k1, 'one']]);

  t.throws(() => s.init(k1, 'other'), {
    message:
      // Should be able to use more informative error once SES double
      // disclosure bug is fixed. See
      // https://github.com/endojs/endo/pull/640
      //
      // /"store1" already registered:/,
      /.* already registered:/,
  });
  t.throws(() => s.get(k2), { message: /"store1" not found:/ });
  t.throws(() => s.set(k2, 'other'), { message: /"store1" not found:/ });
  t.throws(() => s.delete(k2), { message: /"store1" not found:/ });

  s.init(k2, 'two');
  t.truthy(s.has(k1));
  t.truthy(s.has(k2));
  t.is(s.get(k1), 'one');
  t.is(s.get(k2), 'two');
  checkEntries([
    [k1, 'one'],
    [k2, 'two'],
  ]);

  s.set(k1, 'oneplus');
  t.truthy(s.has(k1));
  t.truthy(s.has(k2));
  t.is(s.get(k1), 'oneplus');
  t.is(s.get(k2), 'two');
  checkEntries([
    [k1, 'oneplus'],
    [k2, 'two'],
  ]);

  s.delete(k1);
  t.falsy(s.has(k1));
  t.truthy(s.has(k2));
  t.is(s.get(k2), 'two');
  checkEntries([[k2, 'two']]);

  s.delete(k2);
  t.falsy(s.has(k1));
  t.falsy(s.has(k2));
  checkEntries([]);
}

test('store', t => {
  // makeScalarMap
  check(t, 'strong', count => count); // simple numeric keys
  check(t, 'strong', count => `${count}`); // simple strings
  check(t, 'strong', () => Far('handle', {}));

  // makeScalarWeakMap
  check(t, 'weak', () => Far('handle', {}));
});

test('reject promise keys', t => {
  const k = harden(Promise.resolve());
  const s = makeScalarMap('store1');
  t.throws(() => s.init(k, 1), { message: /Must be structure:/ });
  t.is(s.has(k), false);
  t.throws(() => s.get(k), { message: /not found:/ });
  t.throws(() => s.set(k, 1), { message: /not found/ });
  t.throws(() => s.delete(k), { message: /not found/ });

  const w = makeScalarWeakMap('store1');
  t.throws(() => w.init(k, 1), { message: /only identity-based/ });
  t.is(s.has(k), false);
  t.throws(() => w.get(k), { message: /not found/ });
  t.throws(() => w.set(k, 1), { message: /not found/ });
  t.throws(() => w.delete(k), { message: /not found/ });
});

test('passability of stores', t => {
  t.is(passStyleOf(makeScalarMap('foo')), 'remotable');
  t.is(passStyleOf(makeScalarWeakMap('foo')), 'remotable');
  if (ALLOW_IMPLICIT_REMOTABLES) {
    t.is(passStyleOf(makeLegacyMap('foo')), 'remotable');
    t.is(passStyleOf(makeLegacyWeakMap('foo')), 'remotable');
  } else {
    t.throws(() => passStyleOf(makeLegacyMap('foo')), { message: /x/ });
    t.throws(() => passStyleOf(makeLegacyWeakMap('foo')), { message: /x/ });
  }
});
