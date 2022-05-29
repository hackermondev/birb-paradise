const { Command } = require('@sapphire/framework');
const { Time } = require('@sapphire/time-utilities');
const { Message } = require('discord.js');
const { botGiveawayRole } = require('../../../config.json');

class PingBotGiveawaysCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'pingbotgiveaways',
            aliases: ['pbg'],
            description: 'Ping the "Bot Giveaways Role".',
            preconditions: ['GiveawayHoster'],
            cooldownDelay: 30 * Time.Minute,
        });
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async messageRun(message) {
        message.channel.send({
            content: `> <@&${botGiveawayRole}> New giveaway! Please check the above message`,
            allowedMentions: { users: [], roles: [botGiveawayRole], parse: [] },
        });
        message.delete();
    }
}

module.exports = { PingBotGiveawaysCommand };
