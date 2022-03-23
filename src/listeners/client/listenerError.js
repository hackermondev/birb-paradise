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
            event: Events.ListenerError,
        });
    }
    /**
     *
     * @param { Error } error
     * @param { ListenerErrorPayload } payload
     */
    async run(error, payload) {
        this.container.utility.sendException(error, 'Listener');
    }
}

module.exports = { ListenerErrorListener };
