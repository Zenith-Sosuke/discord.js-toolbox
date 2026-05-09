'use strict';

/**
 * @module utils/random
 * Random helpers — no external dependencies.
 */

/**
 * Pick a random element from an array.
 * Throws if the array is empty.
 *
 * @template T
 * @param {T[]} arr
 * @returns {T}
 *
 * @example
 * randomChoice(['rock', 'paper', 'scissors']) // → 'paper'
 */
function randomChoice(arr) {
  if (!arr.length) throw new RangeError('randomChoice: array must not be empty.');
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Pick N unique random elements from an array (Fisher-Yates partial shuffle).
 * Throws if n > arr.length.
 *
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 *
 * @example
 * randomSample(['a','b','c','d'], 2) // → ['c','a']
 */
function randomSample(arr, n) {
  if (n > arr.length) throw new RangeError('randomSample: n cannot exceed array length.');
  const copy = [...arr];
  for (let i = copy.length - 1; i > copy.length - 1 - n; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(copy.length - n);
}

/**
 * Shuffle an array in place using Fisher-Yates and return it.
 *
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 *
 * @example
 * shuffle([1,2,3,4,5]) // → [3,1,5,2,4]
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Return a random integer between min and max (both inclusive).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 *
 * @example
 * randomInt(1, 6) // → 4
 */
function randomInt(min, max) {
  if (min > max) throw new RangeError('randomInt: min must be ≤ max.');
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return true with the given probability (0–1).
 *
 * @param {number} probability  - e.g. 0.3 means 30% chance.
 * @returns {boolean}
 *
 * @example
 * if (chance(0.1)) { // 10% of the time
 *   triggerRareEvent();
 * }
 */
function chance(probability) {
  if (probability < 0 || probability > 1)
    throw new RangeError('chance: probability must be between 0 and 1.');
  return Math.random() < probability;
}

module.exports = { randomChoice, randomSample, shuffle, randomInt, chance };