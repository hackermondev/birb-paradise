const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class SafeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'safe',
            description: 'oh look its safe the admin',
            preconditions: ['Staff'],
        });
    }

    /**
     *
     * @param { Message } message
     */
    messageRun(message) {
        return message.reply(
            'https://tenor.com/view/banned-thor-banned-thor-ban-thor-admin-gif-12850590'
        );
    }
}

module.exports = { SafeCommand };
