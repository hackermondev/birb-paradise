const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');

class CommandDeniedListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'commandDenied',
            once: false,
            event: Events.CommandDenied,
        });
    }
    /**
     *
     * @param { Error } error
     * @param { Message } message
     */
    async run(error, { message }) {
        if (message.deletable) await message.delete();
    }
}

module.exports = { CommandDeniedListener };
