const { Listener, Command, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');

class MessageCommandFinishListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'commandFinish',
            event: Events.MessageCommandFinish,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Command } command
     */
    run(message, command) {
        this.container.statcord.postCommand(command.name, message.author.id);
        this.container.logger.debug(
            `Command ${command.name} ran by ${message.member.user.tag}`
        );
    }
}

module.exports = { MessageCommandFinishListener };
