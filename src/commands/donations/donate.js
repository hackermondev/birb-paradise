const { Command } = require('@sapphire/framework');

class DonateCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'donate',
            preconditions: ['Admin'],
            description: 'command to donate',
            enabled: false,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        return message.reply('Command not ready');
    }
}
