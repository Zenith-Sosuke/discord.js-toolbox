<div align="center">

<img src="https://discord.js.org/static/logo.svg" width="520" alt="discord.js-toolbox" />

<br />
<br />

[![npm version](https://img.shields.io/npm/v/discord.js-toolbox?color=5865F2&style=flat-square&label=npm)](https://www.npmjs.com/package/discord.js-toolbox)
[![downloads](https://img.shields.io/npm/dm/discord.js-toolbox?color=23272A&style=flat-square&label=downloads)](https://www.npmjs.com/package/discord.js-toolbox)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square)](https://discord.js.org)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

**Build production-ready Discord bots faster — safe moderation, clean embeds, pagination, validation, cooldowns, and more.**

</div>

---

## Why use this?

Most Discord bots break in the same places:

- Moderation crashes due to role hierarchy or missing permissions.
- Embed code copy-pasted everywhere with no consistency.
- Pagination logic rewritten for every command.
- No reusable cooldown or validation handling.

`discord.js-toolbox` solves all of that in one package, with safe defaults and zero unnecessary abstractions.

---

## Installation

```bash
npm install discord.js discord.js-toolbox
```

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
```

---

## License

MIT — free to use in your projects.

Built by [Zenith-Sosuke](https://github.com/Zenith-Sosuke). Contributions and issues are welcome.