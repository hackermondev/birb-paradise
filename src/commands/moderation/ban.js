const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class BanCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ban',
            aliases: ['b', 'yeet'],
            description:
                "Bans a member from the server (doesn't currently log anything)",
            preconditions: ['Staff'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     * @returns
     */
    async messageRun(message, args) {
        const member = await args.pickResult('member');
        if (!member.success)
            return this.container.utility.errorReply(message, 'Mention a valid user to ban.');

        const reason = await args
            .pickResult('string')
            .catch(() => 'Reason was not specified.');
        const days = await args.pickResult('number').catch(() => 0);

        if (days > 7) return this.container.utility.errorReply(message, 'Days of messages to delete cannot be more than **7 days**');

        await member.value.ban({
            reason: `Banned by ${message.author.tag}. Reason: "${reason}"`,
            days,
        });

        return message.reply(`${member.value} was banned from the server.`);
    }
}

module.exports = { BanCommand };
