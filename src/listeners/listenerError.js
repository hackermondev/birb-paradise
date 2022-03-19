const {
    Listener,
    ListenerErrorPayload,
    Events,
} = require('@sapphire/framework');
const Sentry = require('@sentry/node');

class ListenerErrorListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'listenerError',
            once: false,
            event: Events.ListenerError,
        });
    }
    /**
     *
     * @param { Error } error
     * @param { ListenerErrorPayload } payload
     */
    async run(error, payload) {
        const sentryID = Sentry.captureException(error);
        this.container.logger.error(
            `Listener error with ID ${sentryID} sent to Sentry`
        );
        // this.container.logger.debug(
        //     `payload message: ${payload.message}, error message: ${error.message}`
        // );
    }
}

module.exports = { ListenerErrorListener };
