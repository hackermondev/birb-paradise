const { Listener } = require('@sapphire/framework');
const { Message } = require('discord.js');

class MessageDeleteLogging extends Listener {
  constructor(context, options) {
      super(context, {
        ...options,
        once: false,
        event: 'messageDelete'
      });
    }

	/**
	 * 
	 * @param { Message } message 
	 */
	run(message) {
		console.log(message);
	}
}

module.exports = { MessageDeleteLogging };