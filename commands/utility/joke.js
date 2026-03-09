import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../../utils/embedFactory.js';

const jokes = [
  { setup: 'Why don\'t scientists trust atoms?', punchline: 'Because they make up everything!' },
  { setup: 'What do you call a fake noodle?', punchline: 'An impasta!' },
  { setup: 'Why did the scarecrow win an award?', punchline: 'He was outstanding in his field!' },
  { setup: 'What do you call a can opener that doesn\'t work?', punchline: 'A can\'t opener!' },
  { setup: 'Why don\'t eggs tell jokes?', punchline: 'They\'d crack each other up!' },
  { setup: 'What do you call a sleeping bull?', punchline: 'A dozer!' },
  { setup: 'Why did the coffee go to the doctor?', punchline: 'It was feeling mugged!' },
  { setup: 'What do you call a bear with no teeth?', punchline: 'A gummy bear!' },
  { setup: 'Why don\'t skeletons fight each other?', punchline: 'They don\'t have the guts!' },
  { setup: 'What did the ocean say to the beach?', punchline: 'Nothing, it just waved!' },
  { setup: 'Why don\'t computers ever get tired?', punchline: 'They just keep processing!' },
  { setup: 'What do you call a fish without eyes?', punchline: 'A fsh!' },
  { setup: 'Why did the student eat his homework?', punchline: 'Because his teacher said it was a piece of cake!' },
  { setup: 'What do you call a dinosaur that crashes his car?', punchline: 'Tyrannosaurus Wrecks!' },
  { setup: 'Why did the cookie go to the doctor?', punchline: 'It felt crumbly!' }
];

export default {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke!'),
  cooldown: 3,
  async execute(interaction) {
    try {
      const joke = jokes[Math.floor(Math.random() * jokes.length)];

      const embed = createInfoEmbed(
        `**${joke.setup}**\n\n||${joke.punchline}||`,
        '😄 Random Joke'
      ).setColor('#FFB347');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in joke command:', error);
      return interaction.reply({
        embeds: [createErrorEmbed('An error occurred while fetching a joke.')],
        ephemeral: true
      });
    }
  }
};
