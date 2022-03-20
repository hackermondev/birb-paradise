const {
    Listener,
    CommandErrorPayload,
    Events,
} = require('@sapphire/framework');
const Sentry = require('@sentry/node');

class MessageCommandErrorListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'error',
            event: Events.MessageCommandError,
        });
    }
    /**
     *
     * @param { Error } error
     * @param { CommandErrorPayload } payload
     */
    async run(error, payload) {
        const sentryID = Sentry.captureException(error);
        this.container.logger.error(
            `Command error with ID ${sentryID} sent to Sentry`
        );
    }
}

module.exports = { MessageCommandErrorListener };
