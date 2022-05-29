const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class ClearCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'clear',
            description: 'Purges a number of messages from a channel.',
            preconditions: ['Staff'],
            aliases: ['prune', 'delete', 'purge'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const user = (await args.pickResult('user')).value ?? null;
        const channel =
            (await args.pickResult('guildTextChannel')).value ??
            message.channel;

        const num = (await args.pickResult('integer')).value;
        if (!num)
            return this.container.utility.errorReply(
                message,
                'You must provide a number of messages to clear.'
            );

        if (num < 1 || num > 100)
            return this.container.utility.errorReply(
                message,
                'The number of messages to delete must be between 1 and 100.'
            );

        if (message.deletable) await message.delete();

        const msgs = (await channel.messages.fetch({ limit: 100 })).filter(
            (msg) => (user ? msg.member.user.id === user.id : true)
        );
        const messages = msgs.map((msg) => msg).slice(0, num);

        if (!messages.length)
            return message.channel.send('No messages to delete.');

        try {
            await channel.bulkDelete(messages);
        } catch (err) {
            return message.channel.send('Could not delete any messages.');
        }

        return true;
    }
}

module.exports = { ClearCommand };
