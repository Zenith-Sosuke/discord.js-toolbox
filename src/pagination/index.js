const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

/**
 * Creates a paginator for an array of embeds
 * Sends buttons to navigate pages and auto-disables after timeout
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * @param {import('discord.js').EmbedBuilder[]} pages - Array of embeds
 * @param {object} [options]
 * @param {number} [options.timeout=60000] - ms before buttons disable
 * @param {boolean} [options.ephemeral=false]
 */
async function paginate(interaction, pages, options = {}) {
  const { timeout = 60000, ephemeral = false } = options;

  if (!pages || pages.length === 0) throw new Error('No pages provided to paginator.');
  if (pages.length === 1) {
    await interaction.reply({ embeds: [pages[0]], ephemeral });
    return;
  }

  let current = 0;

  const getButtons = (disabled = false) =>
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('page_first')
        .setEmoji('⏮️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled || current === 0),
      new ButtonBuilder()
        .setCustomId('page_prev')
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled || current === 0),
      new ButtonBuilder()
        .setCustomId('page_index')
        .setLabel(`${current + 1} / ${pages.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('page_next')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled || current === pages.length - 1),
      new ButtonBuilder()
        .setCustomId('page_last')
        .setEmoji('⏭️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled || current === pages.length - 1),
    );

  const msg = await interaction.reply({
    embeds: [pages[current]],
    components: [getButtons()],
    ephemeral,
    fetchReply: true,
  });

  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: timeout,
    filter: (i) => i.user.id === interaction.user.id,
  });

  collector.on('collect', async (i) => {
    if (i.customId === 'page_first') current = 0;
    else if (i.customId === 'page_prev') current = Math.max(0, current - 1);
    else if (i.customId === 'page_next') current = Math.min(pages.length - 1, current + 1);
    else if (i.customId === 'page_last') current = pages.length - 1;

    await i.update({
      embeds: [pages[current]],
      components: [getButtons()],
    });
  });

  collector.on('end', async () => {
    await msg.edit({ components: [getButtons(true)] }).catch(() => {});
  });
}

/**
 * Splits an array into chunks for paginating data
 * @param {Array} arr
 * @param {number} size - Items per page
 * @returns {Array[]}
 */
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

module.exports = { paginate, chunkArray };
