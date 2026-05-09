/**
 * discord.js-toolbox — Usage Examples
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

  // Components V2
  v2Reply,
  buildTextDisplay, buildSeparator, buildThumbnail,
  buildSection, buildMediaGallery, buildFile,
  buildContainer,
  v2InfoCard, v2ProfileCard,

  // Logging
  createLogger, logger,

  // Component & container builders
  buildButton, buildRow, buildConfirmRow, disableRow,
  buildSelectMenu, buildModal, buildCard, buildFieldPages,

  // Random helpers
  randomChoice, randomSample, shuffle, randomInt, chance,

  // Retry with backoff
  retry, sleep,

  // String sanitization
  escapeMarkdown, stripMarkdown, stripAnsi,
  sanitizeInput, maskSecret, normalizeWhitespace,
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
  console.log(accountAge(member.user));    // "1 year ago"
  console.log(memberAge(member));          // "3 months ago"
  console.log(timeAgo(Date.now() - 5000)); // "5 seconds ago"
}


// ─── COMPONENTS V2 ───────────────────────────────────────────────────────────

// Simple text message — replaces plain content/embeds
async function exampleV2Text(interaction) {
  await interaction.reply(v2Reply([
    buildTextDisplay('# Hello there!\nThis message uses **Components V2**.'),
  ]));
}

// Info card — accent-coloured container with header, body, footer
async function exampleV2InfoCard(interaction) {
  await interaction.reply(v2Reply([
    v2InfoCard({
      header: '📋 **Server Info**',
      body: `Members: **1,234**\nOnline: **456**\nBoosts: **12**`,
      footer: `Updated ${timeAgo(new Date())}`,
      color: 0x5865F2,
    }),
  ]));
}

// Profile card — section with thumbnail accessory + key-value fields
async function exampleV2ProfileCard(interaction) {
  const member = interaction.options.getMember('user');

  await interaction.reply(v2Reply([
    v2ProfileCard({
      title: `**${member.user.tag}**`,
      avatarUrl: member.displayAvatarURL(),
      lines: [
        `Joined ${memberAge(member)}`,
        `${member.roles.cache.size} roles`,
      ],
      fields: [
        { label: 'Account Created', value: accountAge(member.user) },
        { label: 'ID',              value: member.id               },
      ],
      color: member.displayColor || 0x5865F2,
    }),
  ]));
}

// Section with a button accessory
async function exampleV2Section(interaction) {
  const { ButtonStyle } = require('discord.js');

  await interaction.reply(v2Reply([
    buildSection({
      text: [
        '## ⚠️ Confirmation Required',
        'Are you sure you want to ban this user?',
        'This action cannot be undone.',
      ],
      button: {
        customId: 'confirm-ban',
        label: 'Yes, ban them',
        style: ButtonStyle.Danger,
      },
    }),
  ]));
}

// Full container with mixed components
async function exampleV2Container(interaction) {
  const { ButtonStyle } = require('discord.js');

  await interaction.reply(v2Reply([
    buildContainer((c) => c
      .addTextDisplayComponents(buildTextDisplay('## 📣 Announcement'))
      .addSeparatorComponents(buildSeparator())
      .addTextDisplayComponents(buildTextDisplay('We just hit **1,000 members**! 🎉\nThank you all for being part of this community.'))
      .addSeparatorComponents(buildSeparator({ divider: false, spacing: 'large' }))
      .addSectionComponents(
        buildSection({
          text: ['🎁 Click to claim your reward!'],
          button: { customId: 'claim-reward', label: 'Claim', style: ButtonStyle.Success },
        })
      )
    , { accentColor: 0x57F287 }),
  ]));
}

// Media gallery — up to 10 images in a grid
async function exampleV2Gallery(interaction) {
  await interaction.reply(v2Reply([
    buildTextDisplay('## 🖼️ Screenshot Gallery'),
    buildSeparator(),
    buildMediaGallery([
      { url: 'https://example.com/shot1.png', altText: 'Gameplay screenshot 1' },
      { url: 'https://example.com/shot2.png', altText: 'Gameplay screenshot 2' },
      { url: 'https://example.com/shot3.png', spoiler: true },
    ]),
  ]));
}

// Ephemeral V2 reply (works the same — just add ephemeral to extra options)
async function exampleV2Ephemeral(interaction) {
  await interaction.reply(v2Reply([
    buildTextDisplay('🔒 Only you can see this.'),
  ], { ephemeral: true }));
}


// ─── LOGGING ─────────────────────────────────────────────────────────────────

// Named logger per module — recommended pattern
const log = createLogger({ name: 'Moderation', level: 'debug' });

async function exampleLogging(interaction) {
  log.info('Ban command invoked by', interaction.user.tag);
  log.debug('Target member:', interaction.options.getMember('user')?.id);

  // Time an async operation
  const done = log.time('Fetching ban list');
  await interaction.guild.bans.fetch();
  done(); // → [INFO] [Moderation] Fetching ban list completed in 143ms

  log.warn('Ban list is large — consider caching');
  log.error('Something went wrong', new Error('Unknown'));
}

// Use the default logger anywhere without setup
logger.info('Bot is online.');


// ─── BUILDERS ────────────────────────────────────────────────────────────────

const { ButtonStyle } = require('discord.js');

// Confirm/cancel prompt
async function exampleConfirmPrompt(interaction) {
  const row = buildConfirmRow({
    confirmLabel: 'Yes, ban them',
    cancelLabel: 'Cancel',
  });

  const reply = await interaction.reply({
    embeds: [warnEmbed('Are you sure you want to ban this user?')],
    components: [row],
    fetchReply: true,
  });

  const collector = reply.createMessageComponentCollector({ time: 15_000 });

  collector.on('collect', async (i) => {
    if (i.customId === 'confirm') {
      await i.update({ embeds: [successEmbed('User banned.')], components: [disableRow(row)] });
    } else {
      await i.update({ embeds: [errorEmbed('Action cancelled.')], components: [disableRow(row)] });
    }
    collector.stop();
  });
}

// Select menu for role assignment
async function exampleSelectMenu(interaction) {
  const menu = buildSelectMenu({
    customId: 'pick-color-role',
    placeholder: 'Choose a colour role…',
    options: [
      { label: 'Red',   value: 'role-red',   emoji: '🔴' },
      { label: 'Blue',  value: 'role-blue',  emoji: '🔵' },
      { label: 'Green', value: 'role-green', emoji: '🟢' },
    ],
  });

  await interaction.reply({ components: [buildRow(menu)] });
}

// Modal for a report form
async function exampleModal(interaction) {
  const modal = buildModal({
    customId: 'report-modal',
    title: 'Report a User',
    fields: [
      { customId: 'user-id', label: 'User ID',  style: 'short',     required: true  },
      { customId: 'reason',  label: 'Reason',   style: 'paragraph', required: true,
        placeholder: 'Describe what happened…', maxLength: 1000 },
    ],
  });

  await interaction.showModal(modal);
}

// Profile card embed
async function exampleCard(interaction) {
  const member = interaction.options.getMember('user');

  const embed = buildCard({
    title: `${member.user.tag}'s Profile`,
    thumbnail: member.user.displayAvatarURL(),
    color: member.displayColor || 0x5865F2,
    fields: [
      { name: 'Joined Server', value: timeAgo(member.joinedAt),      inline: true },
      { name: 'Account Age',   value: accountAge(member.user),       inline: true },
      { name: 'Roles',         value: `${member.roles.cache.size}`,  inline: true },
    ],
    footer: `ID: ${member.id}`,
  });

  await interaction.reply({ embeds: [embed] });
}

// Paginated field list (e.g. server rules, member list)
async function exampleFieldPages(interaction, members) {
  const fields = members.map((m) => ({
    name: m.user.tag,
    value: `Joined ${timeAgo(m.joinedAt)}`,
    inline: true,
  }));

  const pages = buildFieldPages(fields, { title: 'Server Members', color: 0x57F287 }, 9);
  await paginate(interaction, pages);
}


// ─── RANDOM ──────────────────────────────────────────────────────────────────

function exampleRandom() {
  const outcomes = ['heads', 'tails'];
  console.log(randomChoice(outcomes)); // → 'heads' or 'tails'

  // Pick 3 winners from a list of entrants
  const entrants = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];
  const winners = randomSample(entrants, 3);
  console.log('Winners:', winners); // → ['Carol', 'Alice', 'Eve']

  // Shuffle a deck
  const deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  console.log('Shuffled:', shuffle([...deck]));

  // Roll a dice
  console.log('d20:', randomInt(1, 20)); // → 14

  // 10% rare drop chance
  if (chance(0.1)) console.log('Rare item dropped!');
}

// In a /coinflip command
async function exampleCoinflip(interaction) {
  const result = randomChoice(['Heads', 'Tails']);
  await interaction.reply({ embeds: [infoEmbed(`🪙 ${result}!`)] });
}

// In a /giveaway pick command
async function exampleGiveawayPick(interaction, entrants) {
  if (!entrants.length)
    return interaction.reply({ embeds: [errorEmbed('No entrants to pick from.')] });

  const winners = randomSample(entrants, Math.min(3, entrants.length));
  const list = winners.map((w, i) => `${i + 1}. ${w}`).join('\n');
  await interaction.reply({ embeds: [successEmbed(list, '🎉 Winners')] });
}


// ─── RETRY ───────────────────────────────────────────────────────────────────

// Wrap a flaky API call — retries up to 4 times with exponential backoff
async function exampleRetry(userId) {
  const data = await retry(
    () => fetch(`https://some-api.example.com/users/${userId}`).then((r) => r.json()),
    {
      attempts: 4,
      baseDelay: 500,
      shouldRetry: (err) => err.status !== 404,  // don't retry 404s
      onRetry: (err, attempt, delay) =>
        log.warn(`API retry ${attempt} in ${delay}ms — ${err.message}`),
    }
  );
  return data;
}

// Add a simple delay between bulk operations
async function exampleSleep(members) {
  for (const member of members) {
    await member.roles.add('123456789');
    await sleep(500); // avoid rate limits
  }
}


// ─── SANITIZE ────────────────────────────────────────────────────────────────

// Sanitize user input before putting it in an embed field
async function exampleSanitize(interaction) {
  const rawReason = interaction.options.getString('reason') ?? '';

  const reason = sanitizeInput(rawReason, {
    maxLength: 512,
    escapeMarkdown: true,
    fallback: 'No reason provided.',
  });

  await interaction.reply({ embeds: [infoEmbed(reason, 'Reason')] });
}

// Safe logging — mask a token before printing
function exampleMaskSecret(token) {
  log.info('Using token:', maskSecret(token));
  // → [INFO] [Moderation] Using token: mfa.****
}

// Strip markdown from a user display name before using it in plain text
function exampleStripMarkdown(member) {
  const safeName = stripMarkdown(member.displayName);
  console.log(`Processing actions for: ${safeName}`);
}

// Escape a user's message before echoing it back in an embed
async function exampleEscapeMarkdown(interaction) {
  const raw = interaction.options.getString('message');
  const safe = escapeMarkdown(raw);
  await interaction.reply({ embeds: [infoEmbed(safe, 'Your message')] });
}