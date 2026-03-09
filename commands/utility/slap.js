import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../../utils/embedFactory.js';

export default {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap someone! (jokingly)')
    .addUserOption(o =>
      o.setName('user').setDescription('Who do you want to slap?').setRequired(true)
    ),
  cooldown: 2,
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');

      if (target.id === interaction.user.id) {
        return interaction.reply({
          embeds: [createErrorEmbed('You can\'t slap yourself! That\'s painful! 🤕')],
          ephemeral: true
        });
      }

      if (target.bot && target.id === interaction.client.user.id) {
        return interaction.reply({
          embeds: [createErrorEmbed('Hey! Watch it! 😤')],
          ephemeral: true
        });
      }

      const slaps = [
        '*slaps with a fish* 🐟',
        '*slaps with a newspaper* 📰',
        '*slaps across the face* 👋',
        '*slaps with a pizza* 🍕',
        '*slaps with a pancake* 🥞'
      ];

      const slap = slaps[Math.floor(Math.random() * slaps.length)];

      const embed = createInfoEmbed(
        `**${interaction.user.displayName}** slaps **${target.displayName}**\n\n${slap}`,
        'Slap!'
      ).setColor('#FF6B6B');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in slap command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while executing that slap.')],
        ephemeral: true
      });
    }
  }
};
