const { Listener, Events } = require('@sapphire/framework');
const { DurationFormatter } = require('@sapphire/time-utilities');
const Sentry = require('@sentry/node');
const { Message } = require('discord.js');
const { ErrorEmbed } = require('../../library/embeds');

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
    async run(_error, { message }) {
        console.log(_error);
        console.log(_error.name)
        if(_error.precondition.name == 'Cooldown') {
            return message.channel.send({
                embeds: [
                    ErrorEmbed(
                        `You're on cooldown! Please wait **${new DurationFormatter().format(_error.context.remaining)}** before using this command again.`,
                        message.author
                    ),
                ],
            });
        };

        if (message.deletable) await message.delete();
        else
            Sentry.captureMessage(
                `A command was denied but the message wasn't able to be deleted, Message Link ${message.url}`,
                Sentry.Severity.Warning
            );
    }
}

module.exports = { MessageCommandDeniedListener };
