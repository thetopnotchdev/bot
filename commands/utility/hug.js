import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../../utils/embedFactory.js';

export default {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a hug!')
    .addUserOption(o =>
      o.setName('user').setDescription('Who do you want to hug?').setRequired(true)
    ),
  cooldown: 2,
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');

      if (target.id === interaction.user.id) {
        return interaction.reply({
          embeds: [createErrorEmbed('You can\'t hug yourself! That\'s not how it works. 😅')],
          ephemeral: true
        });
      }

      if (target.bot) {
        return interaction.reply({
          embeds: [createErrorEmbed('Aww, trying to hug a bot? They\'re not sentient... yet! 🤖')],
          ephemeral: true
        });
      }

      const embed = createInfoEmbed(
        `**${interaction.user.displayName}** hugs **${target.displayName}**\n\n*gives a warm, friendly hug* 🤗`,
        'Hug!'
      ).setColor('#FF69B4');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in hug command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while sending that hug.')],
        ephemeral: true
      });
    }
  }
};
