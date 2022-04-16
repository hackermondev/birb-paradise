const { Listener, Events } = require('@sapphire/framework');

class ClientErrorListener extends Listener {
	constructor(context, options) {
        super(context, {
            ...options,
            name: 'clientError',
            event: Events.Error,
        });
    }

	/**
	 * 
	 * @param { Error } error 
	 */
	async run(error) {
		this.container.utility.sendException(error, 'Client');
	}
}

module.exports = { ClientErrorListener };