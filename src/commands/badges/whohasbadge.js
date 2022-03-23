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
        ];
        if (!badgesStrings.includes(rawBadge.value))
            return message
                .reply(
                    `That badge doesn\'t exist. The badges you can search for are: ${badgesStrings.toString()}`
                )
                .then((reply) =>
                    setTimeout(function () {
                        message.delete();
                        reply.delete();
                    }, 3500)
                );
        let index = badgesStrings.indexOf(rawBadge.value);
        let r = await message.reply(
            `Fetching members and checking for the badge ${badgesLiteralStrings[index]}...`
        );
        let guilds = [...this.container.client.guilds.cache.values()];
        for (let i = 0; i < guilds.length; i++) {
            const guild = guilds[i];
            await guild.members.fetch();
        }
        let membersWithBadge = [];
        message.guild.members.cache
            .filter(
                (member) =>
                    member.user.flags &&
                    member.user.flags
                        .toArray()
                        .toString()
                        .includes(badgesLiteralStrings[index])
            )
            .forEach((member) =>
                membersWithBadge.push(`${member.user.tag} (<@${member.id}>)`)
            );
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
                `The following members have the ${
                    badgesLiteralStrings[index]
                } badge: ${membersWithBadge.toString()}`
            );
        }
    }
}

module.exports = { WhoHasBadgeCommand };
