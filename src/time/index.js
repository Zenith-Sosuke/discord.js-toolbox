/**
 * Time utilities for Discord bots
 */

/**
 * Returns how long ago a date was, as a string
 * @param {Date|number} date
 * @returns {string} e.g. "3 days ago"
 */
function timeAgo(date) {
  const ms = Date.now() - (date instanceof Date ? date.getTime() : date);
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years !== 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months !== 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

/**
 * Returns the account age of a Discord user in a readable format
 * @param {import('discord.js').User} user
 * @returns {string}
 */
function accountAge(user) {
  return timeAgo(user.createdAt);
}

/**
 * Returns how long a member has been in the server
 * @param {import('discord.js').GuildMember} member
 * @returns {string}
 */
function memberAge(member) {
  return timeAgo(member.joinedAt);
}

/**
 * Converts a Date to a short date string: DD/MM/YYYY
 * @param {Date} date
 * @returns {string}
 */
function shortDate(date) {
  return date.toLocaleDateString('en-GB');
}

/**
 * Converts a Date to a full date-time string
 * @param {Date} date
 * @returns {string}
 */
function fullDate(date) {
  return date.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
}

/**
 * Adds a duration (in ms) to a date and returns the new Date
 * @param {Date|number} date
 * @param {number} ms
 * @returns {Date}
 */
function addDuration(date, ms) {
  const base = date instanceof Date ? date.getTime() : date;
  return new Date(base + ms);
}

/**
 * Returns a Unix timestamp (seconds) from a Date or ms timestamp
 * @param {Date|number} date
 * @returns {number}
 */
function toUnix(date) {
  return Math.floor((date instanceof Date ? date.getTime() : date) / 1000);
}

module.exports = {
  timeAgo,
  accountAge,
  memberAge,
  shortDate,
  fullDate,
  addDuration,
  toUnix,
};
