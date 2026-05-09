<div align="center">

<img src="https://discord.js.org/static/logo.svg" width="520" alt="discord.js-toolbox" />

<br />
<br />

[![npm version](https://img.shields.io/npm/v/discord.js-toolbox?color=5865F2&style=flat-square&label=npm)](https://www.npmjs.com/package/discord.js-toolbox)
[![downloads](https://img.shields.io/npm/dm/discord.js-toolbox?color=23272A&style=flat-square&label=downloads)](https://www.npmjs.com/package/discord.js-toolbox)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square)](https://discord.js.org)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/types-included-blue?style=flat-square)](./src/index.d.ts)

**Build production-ready Discord bots faster — safe moderation, clean embeds, pagination, Components V2, logging, and more.**

</div>

---

## Why use this?

Most Discord bots break in the same places:

- Moderation crashes due to role hierarchy or missing permissions.
- Embed code copy-pasted everywhere with no consistency.
- Pagination logic rewritten for every command.
- No reusable cooldown or validation handling.
- Components V2 boilerplate repeated across every command.

`discord.js-toolbox` solves all of that in one package, with safe defaults and zero unnecessary abstractions.

---

## Installation

```bash
npm install discord.js discord.js-toolbox
```

> Requires Node.js `>=16.9.0` and discord.js `^14.0.0`.  
> TypeScript types are included — no `@types/` package needed.

---

## Quick Example

```js
const {
  successEmbed,
  errorEmbed,
  safeBan,
  CooldownManager,
} = require('discord.js-toolbox');

const cooldowns = new CooldownManager();

module.exports = {
  name: 'ban',
  async execute(interaction) {
    const { onCooldown, remaining } = cooldowns.check('ban', interaction.user.id, 5000);
    if (onCooldown) {
      return interaction.reply({
        embeds: [errorEmbed(`Wait ${Math.ceil(remaining / 1000)}s before reusing this command.`)],
        ephemeral: true,
      });
    }

    try {
      await safeBan(interaction.member, 'Rule violation.');
      interaction.reply({ embeds: [successEmbed('User banned successfully.')] });
    } catch (err) {
      interaction.reply({ embeds: [errorEmbed(err.message)] });
    }
  },
};
```

---

## Modules

### Moderation

Prevents crashes from permission errors and hierarchy issues before they happen.

```js
canModerate(target, executor)              // → { ok, reason }
safeBan(member, reason, deleteMessageDays)
safeKick(member, reason)
safeTimeout(member, durationMs, reason)
safeUnban(guild, userId, reason)
dmUser(member, embed)                      // → true/false
```

**Duration parsing:**

```js
parseDuration('10m')      // → 600000 (ms)
parseDuration('2h')       // → 7200000
formatDuration(3600000)   // → "1 hour"
```

---

### Embeds

Prebuilt, consistent embed styles — no repeated boilerplate.

```js
successEmbed('User was banned.')
errorEmbed('User not found.', 'Error')
warnEmbed('Are you sure?')
infoEmbed('Bot is online.')
loadingEmbed('Processing...')
customEmbed({ title, description, color, footer, fields })
randomColor()              // → random hex integer for embed color
```

---

### Pagination

Interactive embed menus with buttons, built in.

```js
await paginate(interaction, embedArray, {
  timeout: 60000,   // ms before buttons disable (default: 60s)
  ephemeral: false,
});

chunkArray(array, 10)  // Split any array into pages of 10.
```

---

### Formatters

```js
truncate('long text...', 50)
titleCase('hello world')            // → "Hello World"
formatNumber(1500000)               // → "1,500,000"
formatBytes(2048000)                // → "1.95 MB"
discordTimestamp(new Date(), 'R')   // → relative Discord timestamp
codeBlock('code here', 'js')
inlineCode('text')
mention(userId)
channelMention(channelId)
roleMention(roleId)
pluralize(1, 'member')              // → "1 member"
pluralize(5, 'member')              // → "5 members"
getTag(user)                        // → "Username" (handles new username system)
stripMarkdown('**bold**')           // → "bold"
```

**Timestamp styles:**

| Flag | Output |
|------|--------|
| `t` | 9:30 PM |
| `T` | 9:30:00 PM |
| `d` | 03/22/2026 |
| `D` | March 22, 2026 |
| `f` | March 22, 2026 9:30 PM |
| `F` | Sunday, March 22, 2026 9:30 PM |
| `R` | 3 hours ago |

---

### Validators

```js
isValidId('822374428541190155')
isValidUrl('https://example.com')
isImageUrl('https://x.com/img.png')
isValidHex('#FF5733')
hexToInt('#FF5733')                        // → 16734003
hasPermissions(member, [PermissionFlagsBits.BanMembers])
getMissingPermissions(member, perms)       // → array of missing perm names
isInRange('hello', 1, 100)
inNumericRange(50, 1, 100)
isValidDuration('10m')                     // → true/false
isValidRole(guild, roleId)                 // → true/false
clamp(value, min, max)                     // → number clamped to range
```

---

### Permissions

```js
isOwner(member)
isAdmin(member)
isModerator(member)
botHasChannelPerm(channel, perm)
botMissingChannelPerms(channel, perms)
```

---

### Time

```js
timeAgo(date)
accountAge(user)
memberAge(member)
shortDate(date)        // → "22/03/2026"
fullDate(date)         // → "22 March 2026 at 09:30"
addDuration(date, ms)
toUnix(date)
msToSeconds(ms)        // → 60000 → 60
daysUntil(date)        // → number of days from now
```

---

### Cooldowns & Errors

```js
const cooldowns = new CooldownManager();

const { onCooldown, remaining } = cooldowns.check('imagine', userId, 10000);
if (onCooldown) return interaction.reply({
  embeds: [errorEmbed(`Try again in ${remaining / 1000}s.`)]
});
```

**Custom error classes:**

```js
throw new PermissionError();
throw new UserNotFoundError();
throw new InvalidArgumentError('Duration must be a valid format.');
throw new CooldownError(remaining);
throw new RateLimitError(retryAfter);
throw new NotInGuildError();
```

---

### Logging

Structured, coloured console logger with named instances and log levels.

```js
const log = createLogger({ name: 'Moderation', level: 'debug' });

log.debug('Checking role hierarchy...');
log.info('User banned successfully.');
log.warn('Missing permission on #general.');
log.error('Unhandled error', err);

// Timer helper
const done = log.time('Fetch ban list');
await guild.bans.fetch();
done(); // → [INFO] [Moderation] Fetch ban list completed in 142ms

// Default logger — no setup needed
logger.info('Bot is online.');
```

**Options:**

```js
createLogger({
  name: 'Bot',          // label in every line
  level: 'info',        // 'debug' | 'info' | 'warn' | 'error' | 'none'
  timestamps: true,     // prepend [HH:MM:SS]
  colors: true,         // ANSI colours
})
```

---

### Builders (V1 Components)

Fluent helpers for classic discord.js v14 components.

```js
// Buttons
buildButton({ customId, label, style, emoji, url, disabled })
buildRow(...components)
buildConfirmRow({ confirmLabel, cancelLabel, confirmId, cancelId })
disableRow(row)           // disables all buttons after a confirmation

// Select menus
buildSelectMenu({ customId, placeholder, minValues, maxValues, options })

// Modals
buildModal({ customId, title, fields })

// Embed containers
buildCard({ title, thumbnail, image, color, footer, fields })
buildFieldPages(fields, baseOptions, fieldsPerPage)  // auto-paginated field embeds
```

**Example — confirm prompt:**

```js
const row = buildConfirmRow({ confirmLabel: 'Yes, ban them', cancelLabel: 'Cancel' });

const reply = await interaction.reply({
  embeds: [warnEmbed('Are you sure?')],
  components: [row],
  fetchReply: true,
});

// After confirmed:
await interaction.editReply({ components: [disableRow(row)] });
```

---

### Components V2

Full support for Discord's new Components V2 system (released March 2025).  
Replaces embeds with a flexible, layout-first component tree.

> **Note:** Components V2 messages cannot use `content`, `embeds`, `poll`, or `stickers`.  
> Max 40 total components and 4000 characters across all text displays per message.

```js
// Always spread v2Reply() into your interaction.reply() / channel.send()
await interaction.reply(v2Reply([
  buildTextDisplay('# Hello!\nThis uses **Components V2**.'),
]));

// Ephemeral
await interaction.reply(v2Reply([myContainer], { ephemeral: true }));
```

**All builders:**

```js
buildTextDisplay(content)
buildSeparator({ divider, spacing })          // spacing: 'small' | 'large'
buildThumbnail({ url, altText, spoiler })
buildSection({ text, button, thumbnail })     // 1–3 text lines + accessory
buildMediaGallery(items)                      // up to 10 images in a grid
buildFile(url, spoiler)                       // inline file display
buildContainer(builderFn, { accentColor, spoiler })
```

**Preset containers:**

```js
// Info card — replaces infoEmbed
v2InfoCard({ header, body, footer, color })

// Profile card — avatar thumbnail + key-value fields
v2ProfileCard({ title, avatarUrl, lines, fields, color })
```

**Full container example:**

```js
const { ButtonStyle } = require('discord.js');

await interaction.reply(v2Reply([
  buildContainer((c) => c
    .addTextDisplayComponents(buildTextDisplay('## 📣 Announcement'))
    .addSeparatorComponents(buildSeparator())
    .addTextDisplayComponents(buildTextDisplay('We just hit **1,000 members**! 🎉'))
    .addSectionComponents(
      buildSection({
        text: ['🎁 Claim your reward!'],
        button: { customId: 'claim', label: 'Claim', style: ButtonStyle.Success },
      })
    )
  , { accentColor: 0x57F287 }),
]));
```

---

### Random

```js
randomChoice(['rock', 'paper', 'scissors'])  // → 'paper'
randomSample(array, 3)                        // → 3 unique random elements
shuffle([1, 2, 3, 4, 5])                      // → shuffled array (in place)
randomInt(1, 100)                             // → integer between 1 and 100
chance(0.1)                                   // → true 10% of the time
```

---

### Retry

Retry a flaky async function with exponential back-off.

```js
const data = await retry(
  () => fetch('https://api.example.com/users').then(r => r.json()),
  {
    attempts: 4,
    baseDelay: 500,
    shouldRetry: (err) => err.status !== 404,
    onRetry: (err, attempt, delay) =>
      log.warn(`Retry ${attempt} in ${delay}ms — ${err.message}`),
  }
);

// Simple delay
await sleep(500);
```

---

### Sanitize

Safe string handling for user input, logs, and embeds.

```js
sanitizeInput(rawString, { maxLength: 512, escapeMarkdown: true, fallback: 'N/A' })
escapeMarkdown('**bold**')          // → '\*\*bold\*\*'
stripMarkdown('**bold**')           // → 'bold'
stripAnsi('\x1b[32mGreen\x1b[0m')  // → 'Green'
maskSecret('mfa.VkO9AbCdEf')       // → 'mfa.****'
normalizeWhitespace('hello   world') // → 'hello world'
```

---

## License

MIT — free to use in your projects.

Built by [Zenith-Sosuke](https://github.com/Zenith-Sosuke). Contributions and issues are welcome.