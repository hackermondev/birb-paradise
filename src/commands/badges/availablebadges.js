const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class AvailableBadgesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'availablebadges',
            aliases: ['badges'],
            description:
                'Gets you the available badges that you can lookup with the whohasbadge command',
            preconditions: ['Admin'],
        });
    }

    /**
     *
     * @param { Message } message
     */
    messageRun(message) {
        const badgesStrings = [
            'Discord Staff',
            'Hypesquad Brilliance',
            'Hypesquad Balance',
            'hypesquad Bravery',
            'Early Verified Bot Developer',
            'Discord Certified Moderator',
            'Hypesquad Events',
            'Early Supporter',
            'Partner',
            'Bug Hunter Level 1',
            'Bug Hunter Level 2',
        ];
        return message.reply(
            `The badges that are currently supported are **${badgesStrings
                .map((badge) =>
                    badge
                        .split(' ')
                        .map((word) => word[0].toUpperCase() + word.slice(1))
                        .join(' ')
                )
                .join(', ')}**`
        );
    }
}

module.exports = { AvailableBadgesCommand };
