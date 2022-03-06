const { Listener } = require('@sapphire/framework');
const { Message, MessageEmbed, WebhookClient } = require('discord.js');
const { msgLogWebhookID, msgLogWebhookToken } = require('../../config.json');

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