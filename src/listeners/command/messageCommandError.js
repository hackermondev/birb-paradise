const {
    Listener,
    MessageCommandErrorPayload,
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
     * @param { MessageCommandErrorPayload } payload
     */
    async run(error, payload) {
        this.container.utility.sendException(error, 'Command');
    }
}

module.exports = { MessageCommandErrorListener };
