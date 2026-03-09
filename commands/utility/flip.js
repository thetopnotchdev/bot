import { SlashCommandBuilder } from 'discord.js';
import { createSuccessEmbed } from '../../utils/embedFactory.js';

export default {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flip a coin!')
    .addStringOption(o =>
      o.setName('choice').setDescription('Your choice: heads or tails').setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        )
    ),
  cooldown: 1,
  async execute(interaction) {
    try {
      const userChoice = interaction.options.getString('choice');
      const flip = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = userChoice === flip;

      const result = won ? '✅ You won!' : '❌ You lost!';
      const color = won ? '#57F287' : '#ED4245';

      const embed = createSuccessEmbed(
        `**Your choice:** ${userChoice}\n**Coin result:** ${flip}\n\n${result}`,
        '🪙 Coin Flip'
      ).setColor(color);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in flip command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while flipping the coin.')],
        ephemeral: true
      });
    }
  }
};
