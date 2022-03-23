const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class SayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'say',
            preconditions: ['Admin'],
            description: 'idk you can say stuff with this',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const whatToSay = await args.restResult('string');
        if (!whatToSay.success)
            return this.container.utility.errorReply(
                message,
                'You need to tell me something to say'
            );
        if (whatToSay.value.length > 500)
            return this.container.utility.errorReply(
                message,
                'Your message is too long'
            );
        await message.channel.send({
            content: whatToSay.value,
            allowedMentions: { users: [], roles: [], parse: [] },
        });
        return message.delete();
    }
}

module.exports = { SayCommand };
