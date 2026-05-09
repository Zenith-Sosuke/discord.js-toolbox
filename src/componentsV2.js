'use strict';

/**
 * @module componentsV2
 * Helpers for Discord's Components V2 system (released March 2025).
 *
 * IMPORTANT RULES when using Components V2:
 *  - You MUST pass `flags: MessageFlags.IsComponentsV2` in every reply/send call.
 *  - You CANNOT use `content`, `embeds`, `poll`, or `stickers` in the same message.
 *  - Once a message is sent with this flag it cannot be removed.
 *  - Max 40 total components per message (nested ones count).
 *  - Max 4000 characters across all TextDisplay components.
 *  - All attached files must be explicitly referenced inside a component.
 */

const {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ThumbnailBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  FileBuilder,
  MessageFlags,
  ButtonStyle,
  ButtonBuilder,
} = require('discord.js');

// ─── Reply helper ─────────────────────────────────────────────────────────────

/**
 * The options object you spread into interaction.reply() / channel.send()
 * to enable Components V2. Always use this instead of hardcoding the flag.
 *
 * @example
 * await interaction.reply({ ...v2Reply([myContainer]) });
 * await interaction.reply({ ...v2Reply([myContainer], { ephemeral: true }) });
 *
 * @param {any[]}   components  - Top-level V2 components array.
 * @param {object}  [extra]     - Any extra options (ephemeral, files, etc.).
 * @returns {{ components: any[], flags: MessageFlags }}
 */
function v2Reply(components, extra = {}) {
  return {
    ...extra,
    components,
    flags: MessageFlags.IsComponentsV2,
  };
}

// ─── TextDisplay ──────────────────────────────────────────────────────────────

/**
 * Create a TextDisplayBuilder with markdown content.
 * Replaces the old `content` field — supports all Discord markdown.
 *
 * @param {string} content  - Markdown text (mentions will notify users/roles!).
 * @returns {TextDisplayBuilder}
 *
 * @example
 * buildTextDisplay('# Welcome\nHello **world**!')
 */
function buildTextDisplay(content) {
  return new TextDisplayBuilder().setContent(content);
}

// ─── Separator ────────────────────────────────────────────────────────────────

/**
 * Create a SeparatorBuilder for vertical spacing between components.
 *
 * @param {object}  [options]
 * @param {boolean} [options.divider=true]   - Show a visible horizontal line.
 * @param {'small'|'large'} [options.spacing='small'] - Padding size.
 * @returns {SeparatorBuilder}
 *
 * @example
 * buildSeparator()                         // line + small spacing (default)
 * buildSeparator({ divider: false, spacing: 'large' }) // just whitespace
 */
function buildSeparator({ divider = true, spacing = 'small' } = {}) {
  return new SeparatorBuilder()
    .setDivider(divider)
    .setSpacing(spacing === 'large' ? SeparatorSpacingSize.Large : SeparatorSpacingSize.Small);
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

/**
 * Create a ThumbnailBuilder for use as a Section accessory.
 * Supports `attachment://filename.png` or any external URL.
 *
 * @param {object} options
 * @param {string}  options.url         - Image URL or `attachment://filename`.
 * @param {string}  [options.altText]   - Accessibility description.
 * @param {boolean} [options.spoiler]   - Blur the image until clicked.
 * @returns {ThumbnailBuilder}
 *
 * @example
 * buildThumbnail({ url: member.displayAvatarURL(), altText: 'User avatar' })
 * buildThumbnail({ url: 'attachment://banner.png', spoiler: true })
 */
function buildThumbnail({ url, altText, spoiler = false } = {}) {
  const thumb = new ThumbnailBuilder().setURL(url);
  if (altText) thumb.setDescription(altText);
  if (spoiler)  thumb.setSpoiler(true);
  return thumb;
}

// ─── Section ──────────────────────────────────────────────────────────────────

/**
 * Create a SectionBuilder — 1–3 lines of text with an optional accessory
 * (button or thumbnail) displayed beside them.
 *
 * @param {object} options
 * @param {string|string[]}  options.text        - One to three markdown strings.
 * @param {object}           [options.button]    - Button accessory config.
 * @param {string}             options.button.customId
 * @param {string}             options.button.label
 * @param {ButtonStyle}        [options.button.style]   - Defaults to Primary.
 * @param {string|object}      [options.button.emoji]
 * @param {ThumbnailBuilder}  [options.thumbnail] - Thumbnail accessory (alternative to button).
 * @returns {SectionBuilder}
 *
 * @example
 * // With a button accessory
 * buildSection({
 *   text: ['## User Profile', '**Joined:** 3 months ago', '**Roles:** 4'],
 *   button: { customId: 'view-profile', label: 'View', style: ButtonStyle.Secondary },
 * })
 *
 * @example
 * // With a thumbnail accessory
 * buildSection({
 *   text: '**ZenithFKX** — Bot Developer',
 *   thumbnail: buildThumbnail({ url: user.displayAvatarURL() }),
 * })
 */
function buildSection({ text, button, thumbnail } = {}) {
  const lines = Array.isArray(text) ? text.slice(0, 3) : [text];
  if (!lines.length) throw new RangeError('buildSection: at least one text string is required.');

  const section = new SectionBuilder().addTextDisplayComponents(
    ...lines.map((t) => new TextDisplayBuilder().setContent(t))
  );

  if (button) {
    section.setButtonAccessory((btn) => {
      btn
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(button.style ?? ButtonStyle.Primary);
      if (button.emoji) btn.setEmoji(button.emoji);
      return btn;
    });
  } else if (thumbnail) {
    section.setThumbnailAccessory(() => thumbnail);
  }

  return section;
}

// ─── MediaGallery ─────────────────────────────────────────────────────────────

/**
 * Create a MediaGalleryBuilder displaying up to 10 images in a grid.
 *
 * @param {Array<{url: string, altText?: string, spoiler?: boolean}>} items
 * @returns {MediaGalleryBuilder}
 *
 * @example
 * buildMediaGallery([
 *   { url: 'https://example.com/img1.png', altText: 'First screenshot' },
 *   { url: 'attachment://proof.png',       spoiler: true },
 * ])
 */
function buildMediaGallery(items = []) {
  if (!items.length || items.length > 10)
    throw new RangeError('buildMediaGallery: provide between 1 and 10 items.');

  return new MediaGalleryBuilder().addItems(
    ...items.map(({ url, altText, spoiler = false }) => {
      const item = new MediaGalleryItemBuilder().setURL(url);
      if (altText) item.setDescription(altText);
      if (spoiler)  item.setSpoiler(true);
      return item;
    })
  );
}

// ─── File ─────────────────────────────────────────────────────────────────────

/**
 * Create a FileBuilder that displays an uploaded file inline in the message.
 * Use `attachment://filename` as the URL and pass the AttachmentBuilder in `files:`.
 *
 * @param {string}  url             - Must be `attachment://filename.ext`.
 * @param {boolean} [spoiler=false] - Blur the file preview until clicked.
 * @returns {FileBuilder}
 *
 * @example
 * const { AttachmentBuilder } = require('discord.js');
 * const file = new AttachmentBuilder('./report.pdf');
 * await interaction.reply({
 *   ...v2Reply([buildFile('attachment://report.pdf')]),
 *   files: [file],
 * });
 */
function buildFile(url, spoiler = false) {
  const f = new FileBuilder().setURL(url);
  if (spoiler) f.setSpoiler(true);
  return f;
}

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * Create a ContainerBuilder — a rounded, visually distinct box that groups
 * any combination of V2 components with an optional accent colour strip on the left.
 *
 * Accepts a builder function so you can chain `.addTextDisplayComponents()`,
 * `.addSectionComponents()`, `.addSeparatorComponents()`,
 * `.addActionRowComponents()`, `.addMediaGalleryComponents()`, and `.addFileComponents()`.
 *
 * @param {(container: ContainerBuilder) => ContainerBuilder} builderFn
 * @param {object}  [options]
 * @param {number}  [options.accentColor]  - Hex integer e.g. `0x5865F2`.
 * @param {boolean} [options.spoiler]      - Blur all content inside.
 * @returns {ContainerBuilder}
 *
 * @example
 * buildContainer((c) => c
 *   .addTextDisplayComponents(new TextDisplayBuilder().setContent('# Hello!'))
 *   .addSeparatorComponents((sep) => sep)
 *   .addSectionComponents(
 *     buildSection({ text: 'Some detail text', button: { customId: 'ok', label: 'OK' } })
 *   )
 * , { accentColor: 0x57F287 })
 */
function buildContainer(builderFn, { accentColor, spoiler = false } = {}) {
  const container = new ContainerBuilder();
  if (accentColor != null) container.setAccentColor(accentColor);
  if (spoiler)              container.setSpoiler(true);
  return builderFn(container);
}

// ─── Preset containers ────────────────────────────────────────────────────────

/**
 * A ready-made "info card" container: optional header, body text, separator,
 * and optional footer line. Good replacement for infoEmbed in V2 contexts.
 *
 * @param {object} options
 * @param {string}  options.body
 * @param {string}  [options.header]
 * @param {string}  [options.footer]
 * @param {number}  [options.color=0x5865F2]
 * @returns {ContainerBuilder}
 *
 * @example
 * await interaction.reply(v2Reply([
 *   v2InfoCard({ header: '📋 Server Info', body: 'Members: 1,234', footer: 'Updated just now' })
 * ]));
 */
function v2InfoCard({ body, header, footer, color = 0x5865F2 } = {}) {
  return buildContainer((c) => {
    if (header) c.addTextDisplayComponents(new TextDisplayBuilder().setContent(header));
    c.addTextDisplayComponents(new TextDisplayBuilder().setContent(body));
    if (footer) {
      c.addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small));
      c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${footer}`));
    }
    return c;
  }, { accentColor: color });
}

/**
 * A ready-made "profile card" container: thumbnail on the right via a Section,
 * then extra fields below.
 *
 * @param {object} options
 * @param {string}   options.title         - Bold name / title line.
 * @param {string}   options.avatarUrl     - Image shown as thumbnail accessory.
 * @param {string[]} [options.lines]       - Additional text lines in the section (max 2 more).
 * @param {Array<{label:string,value:string}>} [options.fields] - Key-value rows below.
 * @param {number}   [options.color]       - Accent color.
 * @returns {ContainerBuilder}
 *
 * @example
 * await interaction.reply(v2Reply([
 *   v2ProfileCard({
 *     title: `**${member.user.tag}**`,
 *     avatarUrl: member.displayAvatarURL(),
 *     lines: [`Joined ${memberAge(member)}`, `${member.roles.cache.size} roles`],
 *     fields: [{ label: 'Account created', value: accountAge(member.user) }],
 *     color: member.displayColor,
 *   })
 * ]));
 */
function v2ProfileCard({ title, avatarUrl, lines = [], fields = [], color } = {}) {
  const textLines = [title, ...lines].slice(0, 3);
  const thumb     = buildThumbnail({ url: avatarUrl });

  return buildContainer((c) => {
    c.addSectionComponents(
      buildSection({ text: textLines, thumbnail: thumb })
    );

    if (fields.length) {
      c.addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Small));
      fields.forEach(({ label, value }) =>
        c.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${label}:** ${value}`))
      );
    }

    return c;
  }, { accentColor: color });
}

module.exports = {
  // Core flag helper
  v2Reply,

  // Individual component builders
  buildTextDisplay,
  buildSeparator,
  buildThumbnail,
  buildSection,
  buildMediaGallery,
  buildFile,
  buildContainer,

  // Preset containers
  v2InfoCard,
  v2ProfileCard,
};