import { EmbedBuilder } from 'discord.js';
import config from './config.js';

/**
 * Parse emoji ID format: <:name:id> or <a:name:id>
 * Also works with unicode and regular emoji
 */
export function parseEmoji(emojiInput) {
  if (!emojiInput) return '';
  // Already properly formatted
  if (typeof emojiInput === 'string' && (emojiInput.startsWith('<:') || emojiInput.startsWith('<a:'))) {
    return emojiInput;
  }
  // Just an ID number - wrap it (unlikely but handle it)
  if (/^\d+$/.test(emojiInput)) {
    return `<:emoji:${emojiInput}>`;
  }
  return emojiInput;
}

/**
 * Base embed with consistent styling
 */
export function baseEmbed() {
  return new EmbedBuilder()
    .setColor(config.embed.color)
    .setFooter({ 
      text: config.embed.footerText || 'Stacked Utility Bot',
      iconURL: config.embed.footerIconURL
    })
    .setTimestamp();
}

/**
 * Success embed - green color with check mark
 */
export function createSuccessEmbed(description, title = null) {
  const embed = baseEmbed()
    .setColor(config.embed.successColor);
  
  if (title) {
    embed.setTitle(`${parseEmoji(config.emojis.success)} ${title}`);
    embed.setDescription(description);
  } else {
    embed.setDescription(`${parseEmoji(config.emojis.success)} ${description}`);
  }
  
  return embed;
}

/**
 * Error embed - red color with X mark
 */
export function createErrorEmbed(description, title = null) {
  const embed = baseEmbed()
    .setColor(config.embed.errorColor);
  
  if (title) {
    embed.setTitle(`${parseEmoji(config.emojis.error)} ${title}`);
    embed.setDescription(description);
  } else {
    embed.setDescription(`${parseEmoji(config.emojis.error)} ${description}`);
  }
  
  return embed;
}

/**
 * Warning embed - yellow color with warning sign
 */
export function createWarningEmbed(description, title = null) {
  const embed = baseEmbed()
    .setColor(config.embed.warningColor);
  
  if (title) {
    embed.setTitle(`${parseEmoji(config.emojis.warning)} ${title}`);
    embed.setDescription(description);
  } else {
    embed.setDescription(`${parseEmoji(config.emojis.warning)} ${description}`);
  }
  
  return embed;
}

/**
 * Info embed - neutral color with info icon
 */
export function createInfoEmbed(description, title = null) {
  const embed = baseEmbed();
  
  if (title) {
    embed.setTitle(`${parseEmoji(config.emojis.info)} ${title}`);
    embed.setDescription(description);
  } else {
    embed.setDescription(`${parseEmoji(config.emojis.info)} ${description}`);
  }
  
  return embed;
}

/**
 * Moderation embed - for mod logs and actions
 * Shows user, moderator, reason, type, case number
 */
export function createModerationEmbed(data = {}) {
  const {
    type = 'Action',
    caseId = null,
    user = null,
    moderator = null,
    reason = 'No reason provided',
    duration = null,
    color = config.embed.color
  } = data;

  const embed = baseEmbed()
    .setColor(color)
    .setTitle(`${parseEmoji(config.emojis.mod)} ${type}${caseId ? ` • Case #${caseId}` : ''}`);

  const fields = [];
  
  if (user) {
    fields.push({
      name: 'User',
      value: `${user.mention || `<@${user.id}>`} \`${user.id || user}\``,
      inline: true
    });
  }

  if (moderator) {
    fields.push({
      name: 'Moderator',
      value: `${moderator.mention || `<@${moderator.id}>`} \`${moderator.id || moderator}\``,
      inline: true
    });
  }

  fields.push({
    name: 'Reason',
    value: reason,
    inline: false
  });

  if (duration) {
    fields.push({
      name: 'Duration',
      value: duration,
      inline: true
    });
  }

  embed.addFields(fields);
  return embed;
}

/**
 * Giveaway embed - for giveaway announcements
 */
export function createGiveawayEmbed(data = {}) {
  const {
    prize = 'Unknown Prize',
    endsAt = null,
    winners = 1,
    description = null,
    hostId = null,
    requirements = []
  } = data;

  const embed = baseEmbed()
    .setColor('#FFD700') // Gold color for giveaways
    .setTitle(`${parseEmoji(config.emojis.giveaway)} GIVEAWAY`)
    .setDescription(`**Prize:** ${prize}\n\n${description || 'React with 🎉 to enter!'}`);

  const fields = [];

  if (winners > 1 || winners !== 1) {
    fields.push({
      name: 'Winners',
      value: `${winners} ${winners === 1 ? 'winner' : 'winners'}`,
      inline: true
    });
  }

  if (endsAt) {
    fields.push({
      name: 'Ends',
      value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`,
      inline: true
    });
  }

  if (hostId) {
    fields.push({
      name: 'Hosted by',
      value: `<@${hostId}>`,
      inline: true
    });
  }

  if (requirements && requirements.length > 0) {
    fields.push({
      name: 'Requirements',
      value: requirements.join('\n'),
      inline: false
    });
  }

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  return embed;
}

/**
 * User info embed - for profile/user info displays
 */
export function createUserEmbed(user, data = {}) {
  const {
    warnings = 0,
    mutes = 0,
    kicks = 0,
    bans = 0,
    joinedAt = null,
    roles = [],
    customFields = []
  } = data;

  const embed = new EmbedBuilder()
    .setColor(user.accentColor || config.embed.color)
    .setTitle(`${user.displayName || user.username}`)
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
    .addFields(
      {
        name: 'User ID',
        value: `\`${user.id}\``,
        inline: true
      },
      {
        name: 'Created',
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        inline: true
      }
    )
    .setFooter({ text: 'User Information' })
    .setTimestamp();

  if (joinedAt) {
    embed.addFields({
      name: 'Joined Server',
      value: `<t:${Math.floor(joinedAt.getTime() / 1000)}:R>`,
      inline: true
    });
  }

  const modStats = [];
  if (warnings > 0) modStats.push(`${parseEmoji(config.emojis.warning)} ${warnings} warnings`);
  if (mutes > 0) modStats.push(`🔇 ${mutes} mutes`);
  if (kicks > 0) modStats.push(`👢 ${kicks} kicks`);
  if (bans > 0) modStats.push(`🚫 ${bans} bans`);

  if (modStats.length > 0) {
    embed.addFields({
      name: 'Moderation History',
      value: modStats.join(' • '),
      inline: false
    });
  }

  if (roles && roles.length > 0) {
    embed.addFields({
      name: 'Roles',
      value: roles.slice(0, 10).join(', ') || 'None',
      inline: false
    });
  }

  if (customFields && customFields.length > 0) {
    embed.addFields(...customFields);
  }

  return embed;
}

/**
 * List embed - for paginated lists
 */
export function createListEmbed(title, items, options = {}) {
  const {
    description = '',
    color = config.embed.color,
    pageNumber = 1,
    totalPages = 1,
    emptyMessage = 'No items to display.'
  } = options;

  const embed = baseEmbed()
    .setColor(color)
    .setTitle(title);

  if (description) {
    embed.setDescription(description);
  }

  if (items && items.length > 0) {
    embed.addFields({
      name: 'Items',
      value: items.join('\n'),
      inline: false
    });
  } else {
    embed.setDescription(embed.data.description ? `${embed.data.description}\n\n${emptyMessage}` : emptyMessage);
  }

  if (totalPages > 1) {
    embed.setFooter({
      text: `Page ${pageNumber} of ${totalPages}`,
      iconURL: config.embed.footerIconURL
    });
  }

  return embed;
}

/**
 * Statistics embed - for stats/metrics display
 */
export function createStatsEmbed(title, stats = {}, color = config.embed.color) {
  const embed = baseEmbed()
    .setColor(color)
    .setTitle(title);

  const fields = Object.entries(stats).map(([key, value]) => ({
    name: key,
    value: String(value),
    inline: true
  }));

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  return embed;
}

/**
 * Rich embed - for complex, detailed information
 */
export function createRichEmbed(options = {}) {
  const {
    title = null,
    description = '',
    color = config.embed.color,
    thumbnail = null,
    image = null,
    author = null,
    fields = [],
    footer = null
  } = options;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTimestamp();

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);

  if (author) {
    embed.setAuthor({
      name: author.name || '',
      iconURL: author.iconURL,
      url: author.url
    });
  }

  if (fields && fields.length > 0) {
    embed.addFields(fields);
  }

  if (footer) {
    embed.setFooter({
      text: footer.text || '',
      iconURL: footer.iconURL
    });
  } else {
    embed.setFooter({
      text: config.embed.footerText || 'Stacked Utility Bot',
      iconURL: config.embed.footerIconURL
    });
  }

  return embed;
}
