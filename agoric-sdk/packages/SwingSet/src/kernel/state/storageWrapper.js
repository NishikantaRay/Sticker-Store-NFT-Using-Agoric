import { assert } from '@agoric/assert';
import { insistStorageAPI } from '../../storageAPI.js';

// We manage a host-realm Storage object with a has/getKeys/get/set/del API.
// We must protect against cross-realm contamination, and add some
// convenience methods.

// NOTE: There's a lot of suspenders-and-belt paranoia here because we have to
// be vewy, vewy careful with host-realm objects.  This raises a question
// whether ad hoc paranoia is the best engineering practice.  Also, if it's
// important for users of a parameter to be aware of the potentially suspect
// nature of that parameter, perhaps we should establish some naming convention
// that signals that the object could be foreign and thus deserving of
// xenophobia.

/**
 * Create and return a crank buffer, which wraps a storage object with logic
 * that buffers any mutations until told to commit them.
 *
 * @param {*} kvStore  The storage object that this crank buffer will be based on.
 * @param {CreateSHA256}  createSHA256
 * @param { (key: string) => boolean } isConsensusKey
 * @returns {*} an object {
 * crankBuffer,  // crank buffer as described, wrapping `kvStore`
 * commitCrank,  // function to save buffered mutations to `kvStore`
 * abortCrank,   // function to discard buffered mutations
 * }
 */
export function buildCrankBuffer(
  kvStore,
  createSHA256,
  isConsensusKey = () => true,
) {
  insistStorageAPI(kvStore);
  let crankhasher;
  function resetCrankhash() {
    crankhasher = createSHA256();
  }

  // to avoid confusion, additions and deletions should never share a key
  const additions = new Map();
  const deletions = new Set();
  resetCrankhash();

  const crankBuffer = {
    has(key) {
      if (additions.has(key)) {
        return true;
      }
      if (deletions.has(key)) {
        return false;
      }
      return kvStore.has(key);
    },

    *getKeys(start, end) {
      assert.typeof(start, 'string');
      assert.typeof(end, 'string');
      const keys = new Set(kvStore.getKeys(start, end));
      for (const k of additions.keys()) {
        keys.add(k);
      }
      for (const k of deletions.keys()) {
        keys.delete(k);
      }
      for (const k of Array.from(keys).sort()) {
        if ((start === '' || start <= k) && (end === '' || k < end)) {
          yield k;
        }
      }
    },

    get(key) {
      assert.typeof(key, 'string');
      if (additions.has(key)) {
        return additions.get(key);
      }
      if (deletions.has(key)) {
        return undefined;
      }
      return kvStore.get(key);
    },

    set(key, value) {
      assert.typeof(key, 'string');
      assert.typeof(value, 'string');
      additions.set(key, value);
      deletions.delete(key);
      if (isConsensusKey(key)) {
        crankhasher.add('add');
        crankhasher.add('\n');
        crankhasher.add(key);
        crankhasher.add('\n');
        crankhasher.add(value);
        crankhasher.add('\n');
      }
    },

    delete(key) {
      assert.typeof(key, 'string');
      additions.delete(key);
      deletions.add(key);
      if (isConsensusKey(key)) {
        crankhasher.add('delete');
        crankhasher.add('\n');
        crankhasher.add(key);
        crankhasher.add('\n');
      }
    },
  };

  /**
   * Flush any buffered mutations to the underlying storage, and update the
   * activityhash.
   *
   * @returns { { crankhash: string, activityhash: string } }
   */
  function commitCrank() {
    for (const [key, value] of additions) {
      kvStore.set(key, value);
    }
    for (const key of deletions) {
      kvStore.delete(key);
    }
    additions.clear();
    deletions.clear();
    const crankhash = crankhasher.finish();
    resetCrankhash();

    let oldActivityhash = kvStore.get('activityhash');
    if (oldActivityhash === undefined) {
      oldActivityhash = '';
    }
    const hasher = createSHA256('activityhash\n');
    hasher.add(oldActivityhash);
    hasher.add('\n');
    hasher.add(crankhash);
    hasher.add('\n');
    const activityhash = hasher.finish();
    kvStore.set('activityhash', activityhash);

    return { crankhash, activityhash };
  }

  /**
   * Discard any buffered mutations.
   */
  function abortCrank() {
    additions.clear();
    deletions.clear();
    resetCrankhash();
  }

  return harden({ crankBuffer, commitCrank, abortCrank });
}

/**
 * @param {KVStore} kvStore
 */
export function addHelpers(kvStore) {
  // these functions are built on top of the DB interface
  insistStorageAPI(kvStore);

  // NOTE: awkward naming: the thing that returns a stream of keys is named
  // "enumerate..." while the thing that returns a stream of values is named
  // "get..."
  function* enumeratePrefixedKeys(prefix, start = 0) {
    // Return an iterator over all existing keys `${prefix}${N}`, for N
    // starting at `start`, in numeric order. This is implemented with
    // has/get rather than any DB-specific functionality: we could imagine
    // a DB with getRange(start, end), but the numbers would be sorted
    // incorrectly.
    for (let i = start; true; i += 1) {
      const key = `${prefix}${i}`;
      if (kvStore.has(key)) {
        yield key;
      } else {
        return;
      }
    }
  }

  function* getPrefixedValues(prefix, start = 0) {
    for (const key of enumeratePrefixedKeys(prefix, start)) {
      yield kvStore.get(key) || assert.fail('enumerate ensures get');
    }
  }

  function deletePrefixedKeys(prefix, start = 0) {
    // this is kind of like a deleteRange() would be, but can be implemented
    // efficiently without backend DB support because it only looks at
    // numeric suffixes, in sequential order.
    for (const key of enumeratePrefixedKeys(prefix, start)) {
      kvStore.delete(key);
    }
  }

  return harden({
    enumeratePrefixedKeys,
    getPrefixedValues,
    deletePrefixedKeys,
    ...kvStore,
  });
}

// The "KeeperStorage" API is a set of functions { has, get, set, delete,
// enumeratePrefixedKeys, getPrefixedValues, deletePrefixedKeys }. The Kernel
// Keeper manipulates the saved kernel state through an object that
// implements the KeeperStorage API. That object is usually associated with a
// write-back buffer wrapper (the CrankBuffer), but the keeper is unaware of
// that.

export function wrapStorage(kvStore, createSHA256, isConsensusKey) {
  insistStorageAPI(kvStore);
  const { crankBuffer, commitCrank, abortCrank } = buildCrankBuffer(
    kvStore,
    createSHA256,
    isConsensusKey,
  );
  const enhancedCrankBuffer = addHelpers(crankBuffer);
  return { enhancedCrankBuffer, commitCrank, abortCrank };
}
