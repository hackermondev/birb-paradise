const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class MemberCountCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'membercount',
            description: 'Shows you the number of members in this server.',
        });
    }

    /**
     * 
     * @param { Message } message 
     * @returns 
     */
    async messageRun(message) {
        return message.reply(
            `There are ${message.guild.memberCount} members in this server.`
        );
    }
}

module.exports = { MemberCountCommand };
