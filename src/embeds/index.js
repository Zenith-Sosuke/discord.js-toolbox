const { EmbedBuilder } = require('discord.js');

/**
 * Creates a success embed (green)
 * @param {string} description
 * @param {string} [title]
 * @returns {EmbedBuilder}
 */
function successEmbed(description, title = null) {
  const embed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setDescription(`✅ ${description}`)
    .setTimestamp();
  if (title) embed.setTitle(title);
  return embed;
}

/**
 * Creates an error embed (red)
 * @param {string} description
 * @param {string} [title]
 * @returns {EmbedBuilder}
 */
function errorEmbed(description, title = 'Error') {
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Creates a warning embed (yellow)
 * @param {string} description
 * @param {string} [title]
 * @returns {EmbedBuilder}
 */
function warnEmbed(description, title = 'Warning') {
  return new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Creates an info embed (blue)
 * @param {string} description
 * @param {string} [title]
 * @returns {EmbedBuilder}
 */
function infoEmbed(description, title = null) {
  const embed = new EmbedBuilder()
    .setColor(0x3498db)
    .setDescription(`ℹ️ ${description}`)
    .setTimestamp();
  if (title) embed.setTitle(title);
  return embed;
}

/**
 * Creates a loading embed (grey)
 * @param {string} [message]
 * @returns {EmbedBuilder}
 */
function loadingEmbed(message = 'Please wait...') {
  return new EmbedBuilder()
    .setColor(0x95a5a6)
    .setDescription(`⏳ ${message}`);
}

/**
 * Creates a custom embed with common defaults pre-applied
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.description
 * @param {number} [options.color=0x5865F2]
 * @param {string} [options.footer]
 * @param {string} [options.thumbnail]
 * @param {Array}  [options.fields]
 * @returns {EmbedBuilder}
 */
function customEmbed({ title, description, color = 0x5865f2, footer, thumbnail, fields = [] }) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTimestamp();

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (footer) embed.setFooter({ text: footer });
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (fields.length > 0) embed.addFields(fields);

  return embed;
}

module.exports = {
  successEmbed,
  errorEmbed,
  warnEmbed,
  infoEmbed,
  loadingEmbed,
  customEmbed,
};
