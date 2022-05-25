const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class MyBadgesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'mybadges',
            aliases: ['mybadge'],
            description: 'Shows you your badges',
            preconditions: ['Admin'],
        });
    }

    /**
     *
     * @param { Message } message
     */
    messageRun(message) {
        let badges = message.author.flags.toArray().toString();
        badges = badges
            .replace('DISCORD_EMPLOYEE', 'Discord Staff')
            .replace('HOUSE_BRILLIANCE', 'Hypesquad Brilliance')
            .replace('HOUSE_BALANCE', 'Hypesquad Balance')
            .replace(
                'EARLY_VERIFIED_BOT_DEVELOPER',
                'Early Verified Bot Developer'
            )
            .replace(
                'DISCORD_CERTIFIED_MODERATOR',
                'Discord Certified Moderator'
            );
        if (!badges) return message.reply('You have no badges');
        else
            return message.reply(
                `These are the badges you have: **${badges
                    .split(',')
                    .map((badge) =>
                        badge
                            .split(' ')
                            .map(
                                (word) => word[0].toUpperCase() + word.slice(1)
                            )
                            .join(', ')
                    )}**`
            );
    }
}

module.exports = { MyBadgesCommand };
