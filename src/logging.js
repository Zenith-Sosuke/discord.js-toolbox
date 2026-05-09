'use strict';

/**
 * @module logging
 * Structured, coloured console logger for Discord bots.
 * Zero dependencies — uses ANSI escape codes only.
 */

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, none: 4 };

const COLORS = {
  reset: '\x1b[0m',
  dim:   '\x1b[2m',
  bold:  '\x1b[1m',
  debug: '\x1b[36m',   // cyan
  info:  '\x1b[32m',   // green
  warn:  '\x1b[33m',   // yellow
  error: '\x1b[31m',   // red
};

/**
 * Returns a formatted timestamp string: [HH:MM:SS].
 * @returns {string}
 */
function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${COLORS.dim}[${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]${COLORS.reset}`;
}

/**
 * Creates a named logger instance.
 *
 * @param {object} [options]
 * @param {string} [options.name='Bot']        - Label shown in every log line.
 * @param {'debug'|'info'|'warn'|'error'|'none'} [options.level='info'] - Minimum level to output.
 * @param {boolean} [options.timestamps=true]  - Prepend timestamps.
 * @param {boolean} [options.colors=true]      - Use ANSI colours.
 *
 * @example
 * const log = createLogger({ name: 'Moderation', level: 'debug' });
 * log.info('Bot is ready.');
 * log.warn('Missing permission on #general.');
 * log.error('Unhandled error', err);
 */
function createLogger(options = {}) {
  const {
    name       = 'Bot',
    level      = 'info',
    timestamps = true,
    colors     = true,
  } = options;

  const minLevel = LEVELS[level] ?? LEVELS.info;

  function write(levelName, args) {
    if (LEVELS[levelName] < minLevel) return;

    const c      = colors ? COLORS[levelName] : '';
    const r      = colors ? COLORS.reset      : '';
    const b      = colors ? COLORS.bold       : '';
    const label  = `${b}${c}[${levelName.toUpperCase().padEnd(5)}]${r}`;
    const tag    = `${b}[${name}]${r}`;
    const ts     = timestamps ? `${timestamp()} ` : '';

    const method = levelName === 'error' ? 'error' : levelName === 'warn' ? 'warn' : 'log';
    console[method](ts + label + ' ' + tag, ...args);
  }

  return {
    debug : (...args) => write('debug', args),
    info  : (...args) => write('info',  args),
    warn  : (...args) => write('warn',  args),
    error : (...args) => write('error', args),

    /**
     * Log the start of an async operation and return a timer function
     * that logs completion with elapsed time.
     *
     * @param {string} label
     * @returns {() => void} Call this when the operation finishes.
     *
     * @example
     * const done = log.time('Database query');
     * await db.query(...);
     * done(); // → [INFO] [Bot] Database query completed in 42ms
     */
    time(label) {
      const start = Date.now();
      write('debug', [`${label} started`]);
      return () => write('info', [`${label} completed in ${Date.now() - start}ms`]);
    },
  };
}

/**
 * A ready-to-use default logger (name: 'Bot', level: 'info').
 * Import this directly if you don't need a custom name/level.
 *
 * @example
 * const { logger } = require('discord.js-toolbox');
 * logger.info('Shard ready.');
 */
const logger = createLogger();

module.exports = { createLogger, logger };