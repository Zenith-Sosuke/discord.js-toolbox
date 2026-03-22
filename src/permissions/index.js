const { PermissionFlagsBits } = require('discord.js');

/**
 * Common permission bundles for quick bot checks
 */

const MOD_PERMS = [
  PermissionFlagsBits.KickMembers,
  PermissionFlagsBits.BanMembers,
  PermissionFlagsBits.ModerateMembers,
];

const ADMIN_PERMS = [PermissionFlagsBits.Administrator];

const MANAGE_PERMS = [
  PermissionFlagsBits.ManageGuild,
  PermissionFlagsBits.ManageChannels,
  PermissionFlagsBits.ManageRoles,
];

/**
 * Returns true if the member is the guild owner
 * @param {import('discord.js').GuildMember} member
 * @returns {boolean}
 */
function isOwner(member) {
  return member.id === member.guild.ownerId;
}

/**
 * Returns true if the member has Administrator permission
 * @param {import('discord.js').GuildMember} member
 * @returns {boolean}
 */
function isAdmin(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

/**
 * Returns true if the member has any moderation-level permission
 * @param {import('discord.js').GuildMember} member
 * @returns {boolean}
 */
function isModerator(member) {
  return MOD_PERMS.some((perm) => member.permissions.has(perm));
}

/**
 * Checks if the bot has a required permission in a channel
 * @param {import('discord.js').GuildChannel} channel
 * @param {import('discord.js').PermissionResolvable} permission
 * @returns {boolean}
 */
function botHasChannelPerm(channel, permission) {
  return channel.permissionsFor(channel.guild.members.me)?.has(permission) ?? false;
}

/**
 * Gets the bot's missing permissions in a channel
 * @param {import('discord.js').GuildChannel} channel
 * @param {import('discord.js').PermissionResolvable[]} perms
 * @returns {string[]}
 */
function botMissingChannelPerms(channel, perms) {
  const botPerms = channel.permissionsFor(channel.guild.members.me);
  return perms.filter((p) => !botPerms?.has(p)).map((p) => String(p));
}

module.exports = {
  MOD_PERMS,
  ADMIN_PERMS,
  MANAGE_PERMS,
  isOwner,
  isAdmin,
  isModerator,
  botHasChannelPerm,
  botMissingChannelPerms,
};
