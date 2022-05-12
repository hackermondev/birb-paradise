const { Listener, Events } = require('@sapphire/framework');
const Sentry = require('@sentry/node');
const { Message } = require('discord.js');

class MessageCommandDeniedListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'messageCommandDenied',
            event: Events.MessageCommandDenied,
        });
    }
    /**
     *
     * @param { Error } error
     * @param { Message } message
     */
    async run(error, { message }) {
        if (message.deletable) await message.delete();
        else
            Sentry.captureMessage(
                `A command was denied but the message wasn't able to be deleted, Message Link ${message.url}`,
                Sentry.Severity.Warning
            );
    }
}

module.exports = { MessageCommandDeniedListener };
