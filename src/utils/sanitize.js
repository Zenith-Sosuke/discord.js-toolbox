'use strict';

/**
 * @module utils/sanitize
 * String sanitization helpers — safe for use in Discord messages, embeds, and logs.
 */

// Characters Discord treats as markdown
const MARKDOWN_CHARS = /([\\`*_~|>])/g;

/**
 * Escape Discord markdown characters in a string so they render literally.
 *
 * @param {string} str
 * @returns {string}
 *
 * @example
 * escapeMarkdown('**bold** and _italic_') // → '\*\*bold\*\* and \_italic\_'
 */
function escapeMarkdown(str) {
  return String(str).replace(MARKDOWN_CHARS, '\\$1');
}

/**
 * Strip all Discord markdown characters from a string.
 *
 * @param {string} str
 * @returns {string}
 *
 * @example
 * stripMarkdown('**Hello** _world_') // → 'Hello world'
 */
function stripMarkdown(str) {
  return String(str)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g,     '$1')
    .replace(/__(.+?)__/g,     '$1')
    .replace(/_(.+?)_/g,       '$1')
    .replace(/~~(.+?)~~/g,     '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\|\|(.+?)\|\|/g, '$1')
    .replace(/^> /gm, '')
    .replace(/\\/g, '');
}

/**
 * Remove ANSI escape sequences from a string (useful before logging to Discord).
 *
 * @param {string} str
 * @returns {string}
 *
 * @example
 * stripAnsi('\x1b[32mGreen text\x1b[0m') // → 'Green text'
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return String(str).replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Sanitize user-supplied input for safe inclusion in an embed field or message.
 * - Trims whitespace
 * - Removes zero-width / invisible characters
 * - Enforces a max length (Discord's embed field value limit is 1024)
 * - Optionally escapes markdown
 *
 * @param {string}  input
 * @param {object}  [options]
 * @param {number}  [options.maxLength=1024]
 * @param {boolean} [options.escapeMarkdown=false]
 * @param {string}  [options.fallback='(empty)']  - Returned when the cleaned string is empty.
 * @returns {string}
 *
 * @example
 * sanitizeInput(interaction.options.getString('reason'), { maxLength: 512, escapeMarkdown: true })
 */
function sanitizeInput(input, options = {}) {
  const {
    maxLength      = 1024,
    escapeMarkdown: doEscape = false,
    fallback       = '(empty)',
  } = options;

  let cleaned = String(input ?? '')
    .trim()
    // Remove zero-width spaces, joiners, and other invisible Unicode
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u2028\u2029]/g, '')
    // Collapse excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, maxLength);

  if (doEscape) cleaned = escapeMarkdown(cleaned);
  return cleaned || fallback;
}

/**
 * Mask a sensitive string (token, ID, secret) for safe display in logs.
 * Shows the first `visible` characters and replaces the rest with `*`.
 *
 * @param {string} str
 * @param {number} [visible=4]
 * @returns {string}
 *
 * @example
 * maskSecret('Bot mfa.VkO9aBcDeFgHiJkL') // → 'Bot ****...'
 */
function maskSecret(str, visible = 4) {
  const s = String(str);
  if (s.length <= visible) return '*'.repeat(s.length);
  return s.slice(0, visible) + '*'.repeat(Math.min(s.length - visible, 12));
}

/**
 * Normalize whitespace in a string: collapse runs of spaces/tabs to a single space.
 *
 * @param {string} str
 * @returns {string}
 *
 * @example
 * normalizeWhitespace('Hello   world\t!') // → 'Hello world !'
 */
function normalizeWhitespace(str) {
  return String(str).replace(/[ \t]+/g, ' ').trim();
}

module.exports = {
  escapeMarkdown,
  stripMarkdown,
  stripAnsi,
  sanitizeInput,
  maskSecret,
  normalizeWhitespace,
};