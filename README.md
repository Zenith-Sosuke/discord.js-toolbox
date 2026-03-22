# discord.js-toolbox

> A utility library for Discord.js v14 bots — embeds, moderation helpers, pagination, formatters, validators, and more.

Built and maintained by [Zenith-Sosuke](https://github.com/Zenith-Sosuke).

---

## Installation

```bash
npm install discord.js@14
# then clone or copy this repo into your project
```

---

## Usage

```js
const {
  successEmbed, errorEmbed,
  parseDuration, canModerate, safeBan,
  paginate, chunkArray,
  truncate, discordTimestamp,
  CooldownManager,
} = require('./djs-utils/src');
```

---

## Modules

### 🎨 Embeds

Quick embed builders with pre-set colors and icons.

```js
successEmbed('User was banned.')          // ✅ green
errorEmbed('User not found.', 'Error')   // ❌ red
warnEmbed('Are you sure?')               // ⚠️ yellow
infoEmbed('Bot is online.')              // ℹ️ blue
loadingEmbed('Processing...')            // ⏳ grey
customEmbed({ title, description, color, footer, fields })
```

---

### 🔨 Moderation

```js
parseDuration('10m')          // → 600000 (ms)
parseDuration('2h')           // → 7200000
formatDuration(3600000)       // → "1 hour"

canModerate(target, executor) // → { ok, reason }
safeBan(member, reason, deleteMessageDays)
safeKick(member, reason)
safeTimeout(member, durationMs, reason)
dmUser(member, embed)         // → true/false (DM success)
```

---

### 📄 Pagination

Automatically creates paginated embed menus with buttons.

```js
await paginate(interaction, embedArray, {
  timeout: 60000,    // ms before buttons disable (default: 60s)
  ephemeral: false,
});

chunkArray(array, 10) // splits array into pages of 10
```

---

### 🔠 Formatters

```js
truncate('long text...', 50)           // cuts at 50 chars
titleCase('hello world')               // "Hello World"
formatNumber(1500000)                  // "1,500,000"
formatBytes(2048000)                   // "1.95 MB"
discordTimestamp(new Date(), 'R')      // "<t:...:R>" (relative)
codeBlock('code here', 'js')           // ```js\ncode here\n```
inlineCode('text')                     // `text`
mention(userId)                        // <@userId>
channelMention(channelId)              // <#channelId>
roleMention(roleId)                    // <@&roleId>
```

**Discord timestamp styles:**
| Style | Output |
|-------|--------|
| `t` | 9:30 PM |
| `T` | 9:30:00 PM |
| `d` | 03/22/2026 |
| `D` | March 22, 2026 |
| `f` | March 22, 2026 9:30 PM |
| `F` | Sunday, March 22, 2026 9:30 PM |
| `R` | 3 hours ago |

---

### ✅ Validators

```js
isValidId('822374428541190155')      // true
isValidUrl('https://example.com')   // true
isImageUrl('https://x.com/img.png') // true
isValidHex('#FF5733')                // true
hexToInt('#FF5733')                  // 16734003
hasPermissions(member, [PermissionFlagsBits.BanMembers])
getMissingPermissions(member, perms) // returns missing perm names
isInRange('hello', 1, 100)           // true
inNumericRange(50, 1, 100)           // true
```

---

### 🔐 Permissions

```js
isOwner(member)                     // true if guild owner
isAdmin(member)                     // has Administrator
isModerator(member)                 // has kick/ban/timeout
botHasChannelPerm(channel, perm)    // bot has perm in channel
botMissingChannelPerms(channel, []) // returns missing perms
```

---

### ⏱️ Time

```js
timeAgo(date)         // "3 days ago"
accountAge(user)      // "1 year ago"
memberAge(member)     // "2 months ago"
shortDate(date)       // "22/03/2026"
fullDate(date)        // "22 March 2026 at 09:30"
addDuration(date, ms) // returns new Date
toUnix(date)          // unix timestamp in seconds
```

---

### ⚡ Cooldowns & Errors

```js
const cooldowns = new CooldownManager();

// In command:
const { onCooldown, remaining } = cooldowns.check('imagine', userId, 10000);
if (onCooldown) return interaction.reply({ embeds: [errorEmbed(`Try again in ${remaining / 1000}s`)] });

// Custom error classes:
throw new PermissionError();
throw new UserNotFoundError();
throw new InvalidArgumentError('Duration must be a valid format.');
throw new CooldownError(remaining);
```

---
## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full version history.

## License

MIT — free to use in your bots.

---
*djs-utils is actively maintained. Star the repo if it helps your bot!*