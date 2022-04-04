const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class BuboiCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'buboi',
            description: 'oh look its that cool mod',
            preconditions: ['Staff'],
            enabled: false,
        });
    }

    /**
     *
     * @param { Message } message
     */
    messageRun(message) {
        return message.reply('https://tenor.com/view/justin-gif-19942241');
    }
}

module.exports = { BuboiCommand };
