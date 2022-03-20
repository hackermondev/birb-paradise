const {
    Listener,
    CommandErrorPayload,
    Events,
} = require('@sapphire/framework');
const Sentry = require('@sentry/node');

class CommandErrorListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'error',
            event: Events.CommandError,
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
        // this.container.logger.debug(
        //     `payload message: ${payload.message}, error message: ${error.message}`
        // );
    }
}

module.exports = { CommandErrorListener };
