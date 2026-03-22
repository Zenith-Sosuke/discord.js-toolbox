/**
 * String and data formatters for Discord output
 */

/**
 * Truncates a string and appends "..." if it exceeds maxLength
 * @param {string} str
 * @param {number} [maxLength=100]
 * @returns {string}
 */
function truncate(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalizes the first letter of each word
 * @param {string} str
 * @returns {string}
 */
function titleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Formats a number with commas (e.g. 1000000 → "1,000,000")
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

/**
 * Returns a Discord user mention string
 * @param {string} userId
 * @returns {string}
 */
function mention(userId) {
  return `<@${userId}>`;
}

/**
 * Returns a Discord channel mention string
 * @param {string} channelId
 * @returns {string}
 */
function channelMention(channelId) {
  return `<#${channelId}>`;
}

/**
 * Returns a Discord role mention string
 * @param {string} roleId
 * @returns {string}
 */
function roleMention(roleId) {
  return `<@&${roleId}>`;
}

/**
 * Formats a Discord timestamp
 * @param {Date|number} date - Date object or Unix timestamp in ms
 * @param {'t'|'T'|'d'|'D'|'f'|'F'|'R'} [style='f'] - Discord timestamp style
 * @returns {string}
 */
function discordTimestamp(date, style = 'f') {
  const unix = Math.floor((date instanceof Date ? date.getTime() : date) / 1000);
  return `<t:${unix}:${style}>`;
}

/**
 * Wraps text in a Discord code block
 * @param {string} code
 * @param {string} [lang=''] - Language for syntax highlighting
 * @returns {string}
 */
function codeBlock(code, lang = '') {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/**
 * Wraps text in inline code
 * @param {string} text
 * @returns {string}
 */
function inlineCode(text) {
  return `\`${text}\``;
}

/**
 * Formats bytes into a human-readable size string
 * @param {number} bytes
 * @returns {string} e.g. "1.23 MB"
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Pads a string or number on the left to a given length
 * @param {string|number} value
 * @param {number} length
 * @param {string} [char='0']
 * @returns {string}
 */
function padStart(value, length, char = '0') {
  return String(value).padStart(length, char);
}

/**
 * Pluralizes a word based on count
 * @param {string} word
 * @param {number} count
 * @returns {string} e.g. '1 apple', '3 apples'
 */
function pluralize(word, count) {
  return count === 1 ? `${count} ${word}` : `${count} ${word}s`;
}

/**
 * Returns a user's full tag (username#discriminator or just username for new system)
 * @param {import('discord.js').User} user
 * @returns {string}
 */
function getTag(user) {
  return user.discriminator === '0' ? user.username : `${user.username}#${user.discriminator}`;
}
/**
 * Strips Discord markdown from a string
 * @param {string} str
 * @returns {string}
 */
function stripMarkdown(str) {
  return str.replace(/(\*|_|~|`|>|\\)/g, '');
}



module.exports = {
  truncate,
  titleCase,
  formatNumber,
  mention,
  getTag,
    stripMarkdown,
  channelMention,
  roleMention,
  discordTimestamp,
  codeBlock,
  inlineCode,
  formatBytes,
  padStart,
  pluralize
};
