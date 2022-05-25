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

        if (num.value < 1 || num.value > 100)
            return this.container.utility.errorReply(
                message,
                'The number of messages to delete must be between 1 and 100.'
            );

        if (message.deletable) await message.delete();

        const msgs = user
            ? [
                  ...(await channel.messages.fetch({ limit: 100 }))
                      .filter((m) => m.author.id === user.id)
                      .values(),
              ].slice(0, num)
            : await channel.messages.fetch({ limit: num.value });

        if (msgs.size == 0)
            return message.channel.send('No messages to delete.');

        try {
            await channel.bulkDelete(msgs);
        } catch (err) {
            return message.channel.send('Could not delete any messages.');
        }

        return true;
    }
}

module.exports = { ClearCommand };
