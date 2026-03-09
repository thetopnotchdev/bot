import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embedFactory.js';

const choices = ['rock', 'paper', 'scissors'];
const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

function getWinner(user, bot) {
  if (user === bot) return 'tie';
  if (user === 'rock' && bot === 'scissors') return 'win';
  if (user === 'paper' && bot === 'rock') return 'win';
  if (user === 'scissors' && bot === 'paper') return 'win';
  return 'loss';
}

export default {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play rock, paper, scissors against the bot!')
    .addStringOption(o =>
      o.setName('choice').setDescription('Your choice').setRequired(true)
        .addChoices(
          { name: 'Rock', value: 'rock' },
          { name: 'Paper', value: 'paper' },
          { name: 'Scissors', value: 'scissors' }
        )
    ),
  cooldown: 2,
  async execute(interaction) {
    try {
      const userChoice = interaction.options.getString('choice');
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      const result = getWinner(userChoice, botChoice);

      let resultText = '';
      let color = '#FEE75C';

      if (result === 'win') {
        resultText = '✅ You won! Nice!';
        color = '#57F287';
      } else if (result === 'loss') {
        resultText = '❌ You lost! Better luck next time.';
        color = '#ED4245';
      } else {
        resultText = '🤝 It\'s a tie!';
        color = '#2F3136';
      }

      const embed = createSuccessEmbed(
        `${emojis[userChoice]} **Your choice:** ${userChoice}\n${emojis[botChoice]} **Bot\'s choice:** ${botChoice}\n\n${resultText}`,
        'Rock, Paper, Scissors'
      ).setColor(color);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in rps command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while playing rock paper scissors.')],
        ephemeral: true
      });
    }
  }
};
