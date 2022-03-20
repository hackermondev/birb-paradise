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
        return message.reply('<:birbkek:911720041756655656>');
    }
}

module.exports = { SafeCommand };
