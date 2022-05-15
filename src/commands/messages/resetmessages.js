const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class ResetMessagesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'resetmessages',
            description: 'Resets the message count for a member.',
            preconditions: ['Admin'],
            aliases: [
                'resetmessagecount',
                'resetmessagecounts',
                'resetmsgcount',
                'resetmsgs',
            ],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const user = await args.pickResult('user');
        if (!user.success)
            return this.container.utility.errorReply(
                message,
                'You must provide a valid user to reset the messages of'
            );

        const rawID = user.value.id;

        const redisEntry = await this.container.utility.getMessageCount(rawID);
        if (!redisEntry)
            return this.container.utility.errorReply(
                message,
                `${rawID} does not have a message count stored to reset.`
            );
        await this.container.redis.hdel('messages', rawID);

        return message.reply(
            `Reset ${user.value.tag}'s message count to zero.`
        );
    }
}

module.exports = { ResetMessagesCommand };
