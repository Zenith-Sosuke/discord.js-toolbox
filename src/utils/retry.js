'use strict';

/**
 * @module utils/retry
 * Retry an async function with exponential back-off and optional jitter.
 */

/**
 * Retry an async function up to `attempts` times with exponential back-off.
 *
 * @param {() => Promise<any>} fn          - The async function to call.
 * @param {object}             [options]
 * @param {number}  [options.attempts=3]   - Maximum number of attempts (including the first).
 * @param {number}  [options.baseDelay=500]- Initial delay in ms.
 * @param {number}  [options.maxDelay=15000] - Cap for delay growth.
 * @param {number}  [options.factor=2]     - Exponential multiplier per retry.
 * @param {boolean} [options.jitter=true]  - Add random jitter to avoid thundering herd.
 * @param {(err: Error, attempt: number) => boolean} [options.shouldRetry]
 *   - Return false to abort retries early (e.g. for 404 errors).
 * @param {(err: Error, attempt: number, delay: number) => void} [options.onRetry]
 *   - Called before each retry — great for logging.
 * @returns {Promise<any>}
 * @throws  The last error if all attempts are exhausted.
 *
 * @example
 * const data = await retry(() => fetch('https://api.example.com/data'), {
 *   attempts: 4,
 *   onRetry: (err, attempt) => log.warn(`Retry ${attempt}: ${err.message}`),
 * });
 *
 * @example
 * // Abort early on non-transient errors
 * await retry(fetchUser, {
 *   shouldRetry: (err) => err.status !== 404,
 * });
 */
async function retry(fn, options = {}) {
  const {
    attempts    = 3,
    baseDelay   = 500,
    maxDelay    = 15_000,
    factor      = 2,
    jitter      = true,
    shouldRetry = () => true,
    onRetry     = null,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      const isLast = attempt === attempts;
      if (isLast || !shouldRetry(err, attempt)) throw err;

      let delay = Math.min(baseDelay * Math.pow(factor, attempt - 1), maxDelay);
      if (jitter) delay = delay * (0.5 + Math.random() * 0.5);

      if (onRetry) onRetry(err, attempt, Math.round(delay));
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Simple promise-based sleep.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { retry, sleep };