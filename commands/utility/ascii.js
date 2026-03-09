import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../../utils/embedFactory.js';

export default {
  category: 'utility',
  data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Convert text to ASCII art!')
    .addStringOption(o =>
      o.setName('text').setDescription('Text to convert').setRequired(true)
    ),
  cooldown: 2,
  async execute(interaction) {
    try {
      let text = interaction.options.getString('text');

      if (text.length > 20) {
        return interaction.reply({
          embeds: [createErrorEmbed('Text must be 20 characters or less!')],
          ephemeral: true
        });
      }

      // Simple ASCII art conversion
      const asciiChars = text.split('').map(char => {
        const code = char.charCodeAt(0);
        return `\`${code}\``;
      });

      const embed = createInfoEmbed(
        `**Text:** ${text}\n**ASCII Codes:** ${asciiChars.join(' ')}`,
        'ASCII Converter'
      ).setColor('#A29BFE');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in ascii command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while converting to ASCII.')],
        ephemeral: true
      });
    }
  }
};
