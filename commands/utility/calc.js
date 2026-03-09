import { SlashCommandBuilder } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embedFactory.js';

export default {
  category: 'utility',
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Calculate a math expression!')
    .addStringOption(o =>
      o.setName('expression').setDescription('Math expression (e.g., 2+2, 10*5, 100/4)').setRequired(true)
    ),
  cooldown: 1,
  async execute(interaction) {
    try {
      let expression = interaction.options.getString('expression');

      // Remove spaces
      expression = expression.replace(/\s+/g, '');

      // Validate expression - only allow numbers, basic operators, and parentheses
      if (!/^[\d+\-*/().]+$/.test(expression)) {
        return interaction.reply({
          embeds: [createErrorEmbed('Invalid expression! Only use numbers and operators: +, -, *, /')],
          ephemeral: true
        });
      }

      // Prevent division by zero and other attacks
      if (expression.includes('/0')) {
        return interaction.reply({
          embeds: [createErrorEmbed('Cannot divide by zero!')],
          ephemeral: true
        });
      }

      let result;
      try {
        result = Function('"use strict"; return (' + expression + ')')();
      } catch (e) {
        return interaction.reply({
          embeds: [createErrorEmbed('Invalid expression! Check your math syntax.')],
          ephemeral: true
        });
      }

      if (typeof result !== 'number') {
        return interaction.reply({
          embeds: [createErrorEmbed('Expression must result in a number!')],
          ephemeral: true
        });
      }

      // Format the result
      const formatted = Number.isInteger(result) ? result : result.toFixed(4);

      const embed = createSuccessEmbed(
        `**Expression:** \`${interaction.options.getString('expression')}\`\n**Result:** \`${formatted}\``,
        '🧮 Calculator'
      ).setColor('#4ECDC4');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in calc command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while calculating.')],
        ephemeral: true
      });
    }
  }
};
