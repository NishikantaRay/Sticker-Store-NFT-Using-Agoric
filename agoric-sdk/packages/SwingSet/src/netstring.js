/* global Buffer */
import { assert, details as X } from '@agoric/assert';

// adapted from 'netstring-stream', https://github.com/tlivings/netstring-stream/
import { Transform } from 'stream';

const COLON = 58;
const COMMA = 44;

// input is a Buffer, output is a netstring-wrapped Buffer
export function encode(data) {
  const prefix = Buffer.from(`${data.length}:`);
  const suffix = Buffer.from(',');
  return Buffer.concat([prefix, data, suffix]);
}

// input is a sequence of strings, output is a byte pipe
export function netstringEncoderStream() {
  function transform(chunk, encoding, callback) {
    if (!Buffer.isBuffer(chunk)) {
      throw Error('stream requires Buffers');
    }
    let err;
    try {
      this.push(encode(chunk));
    } catch (e) {
      err = e;
    }
    callback(err);
  }
  // (maybe empty) Buffer in, Buffer out. We use writableObjectMode to
  // indicate that empty input buffers are important
  return new Transform({ transform, writableObjectMode: true });
}

// Input is a Buffer containing zero or more netstrings and maybe some
// leftover bytes. Output is zero or more decoded Buffers, one per netstring,
// plus a Buffer of leftover bytes.
//
export function decode(data) {
  // TODO: it would be more efficient to accumulate pending data in an array,
  // rather than doing a concat each time
  let start = 0;
  const payloads = [];

  for (;;) {
    const colon = data.indexOf(COLON, start);
    if (colon === -1) {
      break; // still waiting for `${LENGTH}:`
    }
    const sizeString = data.toString('utf-8', start, colon);
    const size = parseInt(sizeString, 10);
    if (!(size > -1)) {
      // reject NaN, all negative numbers
      assert.fail(X`unparseable size ${sizeString}, should be integer`);
    }
    if (data.length < colon + 1 + size + 1) {
      break; // still waiting for `${DATA}.`
    }
    assert(
      data[colon + 1 + size] === COMMA,
      X`malformed netstring: not terminated by comma`,
    );
    payloads.push(data.subarray(colon + 1, colon + 1 + size));
    start = colon + 1 + size + 1;
  }

  const leftover = data.subarray(start);
  return { leftover, payloads };
}

// input is a byte pipe, output is a sequence of Buffers
export function netstringDecoderStream() {
  let buffered = Buffer.from('');

  function transform(chunk, encoding, callback) {
    if (!Buffer.isBuffer(chunk)) {
      throw Error('stream requires Buffers');
    }
    buffered = Buffer.concat([buffered, chunk]);
    let err;
    try {
      const { leftover, payloads } = decode(buffered);
      buffered = leftover;
      for (let i = 0; i < payloads.length; i += 1) {
        this.push(payloads[i]);
      }
    } catch (e) {
      err = e;
    }
    // we buffer all data internally, to accommodate netstrings larger than
    // Transform's default buffer size, and callback() indicates that we've
    // consumed the input
    callback(err);
  }

  // Buffer in, Buffer out, except that each output Buffer is precious, even
  // empty ones, and without readableObjectMode the Stream will discard empty
  // buffers
  return new Transform({ transform, readableObjectMode: true });
}
