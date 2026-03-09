import { SlashCommandBuilder } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed, createWarningEmbed } from '../../utils/embedFactory.js';
import { getGuildData, saveGuildData } from '../../utils/dataStore.js';

export default {
  category: 'economy',
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily coins!'),
  cooldown: 10,
  async execute(interaction) {
    try {
      const guildData = await getGuildData(interaction.guildId);
      const userId = interaction.user.id;
      const now = Date.now();
      const dailyCooldown = 24 * 60 * 60 * 1000; // 24 hours

      if (!guildData.economy) {
        guildData.economy = {};
      }
      if (!guildData.dailyClaims) {
        guildData.dailyClaims = {};
      }

      const lastClaim = guildData.dailyClaims[userId] || 0;
      const timePassed = now - lastClaim;

      if (timePassed < dailyCooldown) {
        const timeLeft = dailyCooldown - timePassed;
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);

        return interaction.reply({
          embeds: [createWarningEmbed(
            `You've already claimed your daily coins! Come back in **${hours}h ${minutes}m**.`,
            'Come Back Later'
          )],
          ephemeral: true
        });
      }

      const amount = Math.floor(Math.random() * 100) + 50; // 50-150 coins
      guildData.economy[userId] = (guildData.economy[userId] || 0) + amount;
      guildData.dailyClaims[userId] = now;

      await saveGuildData(interaction.guildId, guildData);

      const embed = createSuccessEmbed(
        `You claimed **${amount}** coins! 💰\nYour new balance: **${guildData.economy[userId]}** coins`,
        'Daily Reward'
      ).setColor('#FFD700');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in daily command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while claiming your daily reward.')],
        ephemeral: true
      });
    }
  }
};
