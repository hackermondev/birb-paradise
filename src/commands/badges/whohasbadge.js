const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');
const req = require('petitio');

class WhoHasBadgeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'whohasbadge',
            aliases: ['whohasb', 'whohas'],
            description: 'Gets you the members who have the specified badge',
            preconditions: ['Admin'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const rawBadge = await args.restResult('string');
        if (!rawBadge.success)
            return message
                .reply('You must provide a badge to search for')
                .then((reply) =>
                    setTimeout(function () {
                        message.delete();
                        reply.delete();
                    }, 3500)
                );
        const badgesStrings = [
            'discord staff',
            'hypesquad brilliance',
            'hypesquad balance',
            'hypesquad bravery',
            'early verified bot developer',
            'discord certified moderator',
            'hypesquad events',
            'early supporter',
            'partner',
            'bug hunter level 1',
            'bug hunter level 2',
        ];
        const badgesLiteralStrings = [
            'DISCORD_EMPLOYEE',
            'HOUSE_BRILLIANCE',
            'HOUSE_BALANCE',
            'HOUSE_BRAVERY',
            'EARLY_VERIFIED_BOT_DEVELOPER',
            'DISCORD_CERTIFIED_MODERATOR',
            'HYPESQUAD_EVENTS',
            'EARLY_SUPPORTER',
            'PARTNERED_SERVER_OWNER',
            'BUGHUNTER_LEVEL_1',
            'BUGHUNTER_LEVEL_2',
        ];

        const index = badgesStrings.indexOf(rawBadge.value.toLowerCase());
        if (index == -1)
            return message
                .reply(
                    `That badge doesn\'t exist. The badges you can search for are: **${badgesStrings
                        .map((badge) =>
                            badge
                                .split(' ')
                                .map(
                                    (word) =>
                                        word[0].toUpperCase() + word.slice(1)
                                )
                                .join(' ')
                        )
                        .join(', ')
                        .toString()}**`
                )
                .then((reply) =>
                    setTimeout(function () {
                        message.delete();
                        reply.delete();
                    }, 30000)
                );
        let r = await message.reply(
            `Fetching members and checking for the badge ${badgesLiteralStrings[index]}...`
        );
        await message.guild.members.fetch();
        const membersWithBadge = message.guild.members.cache
            .filter(
                (member) =>
                    member.user.flags &&
                    member.user.flags
                        .toArray()
                        .toString()
                        .includes(badgesLiteralStrings[index])
            )
            .map((member) => `${member.user.tag} (${member.user.toString()})`);
        if (membersWithBadge.length == 0)
            return r.edit(
                `I couldn\'t find anyone who has the ${badgesLiteralStrings[index]} badge`
            );
        if (membersWithBadge.toString().length > 4000) {
            let hastebinOutput = this.container.utility.createHastebin(
                membersWithBadge.toString()
            );
            return r.edit(
                `The list of members was too long to be sent on discord, you can see the list here: ${hastebinOutput}`
            );
        } else {
            return r.edit(
                `The following members have the **${badgesStrings[index]
                    .split(' ')
                    .map((word) => word[0].toUpperCase() + word.slice(1))
                    .join(' ')}** badge: ${membersWithBadge
                    .join(', ')
                    .toString()}`
            );
        }
    }
}

module.exports = { WhoHasBadgeCommand };
