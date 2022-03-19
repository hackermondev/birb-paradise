const {
    Listener,
    CommandErrorPayload,
    Events,
    UserError,
} = require('@sapphire/framework');
const Sentry = require('@sentry/node');

class ErrorListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'error',
            once: false,
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
        this.container.logger.error(`Error with id ${sentryID} sent to Sentry`);
        this.container.logger.debug(
            `payload message: ${payload.message}, error message: ${error.message}`
        );
    }
}

module.exports = { ErrorListener };
