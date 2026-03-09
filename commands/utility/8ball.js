import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../../utils/embedFactory.js';

const answers = [
  // Positive answers
  'Yes, definitely!', 'It is certain.', 'Most likely.', 'Outlook good.', 'Signs point to yes.',
  'You may rely on it.', 'As I see it, yes.', 'Without a doubt.', 'Absolutely.', 'All signs say yes.',
  
  // Non-committal answers
  'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.',
  'Don\'t count on it.', 'Outlook hazy.', 'Unclear, ask again.', 'Maybe...', 'Uncertain.', 'Ask me again later.',
  
  // Negative answers
  'No way.', 'Don\'t count on it.', 'Very doubtful.', 'Outlook not so good.', 'My sources say no.',
  'Not a chance.', 'Absolutely not.', 'Don\'t even think about it.', 'No.', 'Never.', 'Impossible.'
];

export default {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8 ball a question!')
    .addStringOption(o =>
      o.setName('question').setDescription('Your question for the magic 8 ball.').setRequired(true)
    ),
  cooldown: 2,
  async execute(interaction) {
    try {
      const question = interaction.options.getString('question');
      
      if (!question || question.trim().length === 0) {
        return interaction.reply({
          embeds: [createErrorEmbed('Please ask a valid question!')],
          ephemeral: true
        });
      }

      const answer = answers[Math.floor(Math.random() * answers.length)];
      
      const embed = createInfoEmbed(
        `**Your Question:** ${question}\n\n🎱 **Magic 8 Ball says:** ${answer}`,
        '🔮 Magic 8 Ball'
      ).setColor('#1a1a2e');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in 8ball command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while consulting the magic 8 ball.')],
        ephemeral: true
      });
    }
  }
};
