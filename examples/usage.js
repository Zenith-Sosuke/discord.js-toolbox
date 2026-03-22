/**
 * djs-utils — Usage Examples
 * These examples show how to use the library in a Discord.js v14 bot.
 * They won't run standalone (require a bot client), but show real usage patterns.
 */

const {
  // Embeds
  successEmbed, errorEmbed, warnEmbed, infoEmbed, loadingEmbed,

  // Moderation
  parseDuration, formatDuration, canModerate, safeBan, safeTimeout,

  // Pagination
  paginate, chunkArray,

  // Formatters
  truncate, discordTimestamp, codeBlock, formatNumber, formatBytes,

  // Validators
  isValidId, isValidHex, hexToInt, isImageUrl,

  // Permissions
  isAdmin, isModerator, botHasChannelPerm,

  // Time
  timeAgo, accountAge, memberAge,

  // Errors
  CooldownManager, CooldownError, PermissionError,
} = require('./src/index');


// ─── EMBEDS ──────────────────────────────────────────────────────────────────

// In a slash command handler:
async function exampleEmbeds(interaction) {
  // Simple success
  await interaction.reply({ embeds: [successEmbed('User was banned successfully.')] });

  // Error with title
  await interaction.reply({ embeds: [errorEmbed('User not found.', 'Ban Failed')] });

  // Deferred loading state
  await interaction.deferReply();
  // ... do async work ...
  await interaction.editReply({ embeds: [successEmbed('Done!')] });
}


// ─── MODERATION ──────────────────────────────────────────────────────────────

async function exampleBanCommand(interaction) {
  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason') ?? 'No reason provided';
  const durationStr = interaction.options.getString('duration'); // e.g. "7d"

  // Check if moderatable
  const { ok, reason: modReason } = canModerate(target, interaction.member);
  if (!ok) return interaction.reply({ embeds: [errorEmbed(modReason)], ephemeral: true });

  // Parse duration
  const ms = parseDuration(durationStr); // returns ms or null
  console.log(`Banning for ${formatDuration(ms)}`); // "7 days"

  const { success, error } = await safeBan(target, reason);
  if (!success) return interaction.reply({ embeds: [errorEmbed(error)] });

  await interaction.reply({ embeds: [successEmbed(`Banned ${target.user.tag} for ${reason}`)] });
}


// ─── PAGINATION ──────────────────────────────────────────────────────────────

async function exampleLeaderboard(interaction, allUsers) {
  // Split 50 users into pages of 10
  const pages = chunkArray(allUsers, 10).map((chunk, i) => {
    const { EmbedBuilder } = require('discord.js');
    return new EmbedBuilder()
      .setTitle(`Leaderboard — Page ${i + 1}`)
      .setDescription(chunk.map((u, j) => `${i * 10 + j + 1}. ${u.name} — ${u.xp} XP`).join('\n'))
      .setColor(0x5865f2);
  });

  await paginate(interaction, pages, { timeout: 120000 });
}


// ─── FORMATTERS ──────────────────────────────────────────────────────────────

function exampleFormatters() {
  console.log(truncate('This is a very long string that should be cut off', 30));
  // → "This is a very long string tha..."

  console.log(discordTimestamp(new Date(), 'R'));
  // → "<t:1234567890:R>" (shows "3 hours ago" in Discord)

  console.log(formatNumber(1500000));
  // → "1,500,000"

  console.log(formatBytes(2048000));
  // → "1.95 MB"

  console.log(codeBlock('const x = 1;', 'js'));
  // → ```js\nconst x = 1;\n```
}


// ─── VALIDATORS ──────────────────────────────────────────────────────────────

function exampleValidators() {
  console.log(isValidId('822374428541190155')); // true
  console.log(isValidHex('#FF5733'));           // true
  console.log(hexToInt('#FF5733'));             // 16734003
  console.log(isImageUrl('https://example.com/image.png')); // true
}


// ─── COOLDOWNS ───────────────────────────────────────────────────────────────

const cooldowns = new CooldownManager();

async function exampleCooldown(interaction) {
  const { onCooldown, remaining } = cooldowns.check('imagine', interaction.user.id, 10000); // 10s

  if (onCooldown) {
    return interaction.reply({
      embeds: [errorEmbed(`You're on cooldown! Try again in **${(remaining / 1000).toFixed(1)}s**`)],
      ephemeral: true,
    });
  }

  // proceed with command...
}


// ─── TIME ────────────────────────────────────────────────────────────────────

function exampleTime(member) {
  console.log(accountAge(member.user));  // "1 year ago"
  console.log(memberAge(member));        // "3 months ago"
  console.log(timeAgo(Date.now() - 5000)); // "5 seconds ago"
}
