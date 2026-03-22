/**
 * Input validators for Discord bot commands
 */

/**
 * Checks if a string is a valid Discord snowflake ID
 * @param {string} id
 * @returns {boolean}
 */
function isValidId(id) {
  return /^\d{17,20}$/.test(id);
}

/**
 * Checks if a URL is valid
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a URL points to an image (by extension)
 * @param {string} url
 * @returns {boolean}
 */
function isImageUrl(url) {
  if (!isValidUrl(url)) return false;
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

/**
 * Checks if a hex color string is valid
 * @param {string} hex - e.g. "#FF5733" or "FF5733"
 * @returns {boolean}
 */
function isValidHex(hex) {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

/**
 * Converts a hex string to a Discord-compatible integer
 * @param {string} hex
 * @returns {number}
 */
function hexToInt(hex) {
  return parseInt(hex.replace('#', ''), 16);
}

/**
 * Checks if a member has all of the specified permissions
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').PermissionResolvable[]} perms
 * @returns {boolean}
 */
function hasPermissions(member, perms) {
  return perms.every((perm) => member.permissions.has(perm));
}

/**
 * Returns which of the required permissions a member is missing
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').PermissionResolvable[]} perms
 * @returns {string[]} Array of missing permission names
 */
function getMissingPermissions(member, perms) {
  return perms.filter((perm) => !member.permissions.has(perm)).map((p) => String(p));
}

/**
 * Checks if a string is within a min/max character range
 * @param {string} str
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
function isInRange(str, min, max) {
  return str.length >= min && str.length <= max;
}

/**
 * Checks if a number is within a numeric range (inclusive)
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
function inNumericRange(num, min, max) {
  return num >= min && num <= max;
}

/**
 * Checks if a string is a valid duration format e.g. '10m', '2h'
 * @param {string} str
 * @returns {boolean}
 */
function isValidDuration(str) {
  return /^(\d+)([smhdw])$/i.test(str);
}

/**
 * Checks if a role is mentionable and exists in the guild
 * @param {import('discord.js').Guild} guild
 * @param {string} roleId
 * @returns {boolean}
 */
function isValidRole(guild, roleId) {
  return guild.roles.cache.has(roleId);
}

/**
 * Clamps a number between a min and max value
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

module.exports = {
  isValidId,
  isValidUrl,
  isImageUrl,
  isValidHex,
  isValidRole,
  clamp,
  hexToInt,
  isValidDuration,
  hasPermissions,
  getMissingPermissions,
  isInRange,
  inNumericRange,
};
