const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class ResetMessagesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'resetmessages',
            description: 'Resets the message count for a member.',
            aliases: [
                'resetmessagecount',
                'resetmessagecounts',
                'resetmsgcount',
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

        const redisEntry = await this.container.redis.get(`${rawID}_messages`);
        if (!redisEntry)
            return this.container.utility.errorReply(
                `${rawID} does not have a message count stored to reset.`
            );
    }
}
