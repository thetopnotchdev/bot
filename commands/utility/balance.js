import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../../utils/embedFactory.js';
import { getGuildData } from '../../utils/dataStore.js';

export default {
  category: 'economy',
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your currency balance!')
    .addUserOption(o =>
      o.setName('user').setDescription('Check another user\'s balance (optional)')
    ),
  cooldown: 2,
  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const guildData = await getGuildData(interaction.guildId);

      const balance = guildData.economy?.[targetUser.id] || 0;

      const embed = createInfoEmbed(
        `**${targetUser.displayName}** has **${balance}** coins 💰`,
        'Bank Balance'
      ).setColor('#FFD700');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in balance command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while checking the balance.')],
        ephemeral: true
      });
    }
  }
};
