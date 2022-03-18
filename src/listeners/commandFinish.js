const { Listener, Command, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');

class CommandFinishListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'commandFinish',
            once: false,
            event: Events.CommandFinish,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Command } command
     */
    run(message, command) {
        this.container.logger.info(
            `Command ${command.name} ran by ${message.member.user.tag}`
        );
    }
}

module.exports = { CommandFinishListener };
