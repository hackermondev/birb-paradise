const {
    Listener,
    CommandErrorPayload,
    Events,
} = require('@sapphire/framework');

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
        this.container.logger.debug(
            `payload message: ${payload.message}, error message: ${error.message}`
        );
    }
}

module.exports = { ErrorListener };
