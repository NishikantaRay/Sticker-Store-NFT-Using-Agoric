import { assert } from '@agoric/assert';
import { roundToDecimalPlaces } from './helpers/roundToDecimalPlaces.js';

const CONVENTIONAL_DECIMAL_PLACES = 2;

/**
 * @param {NatValue} natValue
 * @param {number} [decimalPlaces]
 * @param {number} [placesToShow]
 * @returns {string}
 */
export const stringifyNat = (
  natValue = null,
  decimalPlaces = 0,
  placesToShow = CONVENTIONAL_DECIMAL_PLACES,
) => {
  if (natValue === null) {
    return '';
  }
  assert.typeof(natValue, 'bigint');
  const str = `${natValue}`.padStart(decimalPlaces, '0');
  const leftOfDecimalStr = str.substring(0, str.length - decimalPlaces) || '0';
  const rightOfDecimalStr = roundToDecimalPlaces(
    `${str.substring(str.length - decimalPlaces)}`,
    placesToShow,
  );

  if (rightOfDecimalStr === '') {
    return leftOfDecimalStr;
  }

  return `${leftOfDecimalStr}.${rightOfDecimalStr}`;
};
