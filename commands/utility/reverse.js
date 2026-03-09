import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../../utils/embedFactory.js';

export default {
  category: 'utility',
  data: new SlashCommandBuilder()
    .setName('reverse')
    .setDescription('Reverse a text!')
    .addStringOption(o =>
      o.setName('text').setDescription('Text to reverse').setRequired(true)
    ),
  cooldown: 1,
  async execute(interaction) {
    try {
      let text = interaction.options.getString('text');

      if (text.length > 1000) {
        return interaction.reply({
          embeds: [createErrorEmbed('Text cannot be longer than 1000 characters!')],
          ephemeral: true
        });
      }

      const reversed = text.split('').reverse().join('');

      const embed = createInfoEmbed(
        `**Original:** ${text}\n**Reversed:** ${reversed}`,
        'Text Reversal'
      ).setColor('#6C5CE7');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in reverse command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while reversing the text.')],
        ephemeral: true
      });
    }
  }
};
