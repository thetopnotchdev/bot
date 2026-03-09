import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createSuccessEmbed } from '../../utils/embedFactory.js';

export default {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a dice!')
    .addIntegerOption(o =>
      o.setName('sides').setDescription('Number of sides (default: 6)').setMinValue(2).setMaxValue(100)
    )
    .addIntegerOption(o =>
      o.setName('count').setDescription('How many dice to roll (default: 1)').setMinValue(1).setMaxValue(20)
    ),
  cooldown: 1,
  async execute(interaction) {
    try {
      const sides = interaction.options.getInteger('sides') ?? 6;
      const count = interaction.options.getInteger('count') ?? 1;

      if (sides < 2) {
        return interaction.reply({
          embeds: [createErrorEmbed('Dice must have at least 2 sides!')],
          ephemeral: true
        });
      }

      if (count < 1 || count > 20) {
        return interaction.reply({
          embeds: [createErrorEmbed('You can only roll 1-20 dice at a time!')],
          ephemeral: true
        });
      }

      const rolls = [];
      let total = 0;

      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
      }

      const embed = createSuccessEmbed(
        `🎲 **Rolls:** ${rolls.join(', ')}\n📊 **Total:** ${total}`,
        `Rolled ${count}d${sides}`
      ).setColor('#FF6B6B');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in dice command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while rolling the dice.')],
        ephemeral: true
      });
    }
  }
};
