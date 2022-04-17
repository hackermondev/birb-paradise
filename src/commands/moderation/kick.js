const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class KickCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'kick',
            aliases: ['k'],
            description:
                "Kicks a member from the server(doesn't currently log anything",
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
            return message.reply('Mention a valid user to kick').then((reply) =>
                setTimeout(function () {
                    reply.delete();
                    message.delete();
                }, 3500)
            );

        const reason = await args
            .pickResult('string')
            .catch(() => 'Reason was not specified.');
        await member.value.kick(
            `Kicked by ${message.author.tag}. Reason: "${reason}"`
        );
        return message.reply(`${member.value} was kicked from the server.`);
    }
}

module.exports = { KickCommand };
