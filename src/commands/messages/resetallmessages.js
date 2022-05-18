const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class ResetAllMessagesCommand extends Command {
	constructor(context, options) {
        super(context, {
            ...options,
            name: 'resetallmessages',
            description: 'Resets the message count for all members.',
            preconditions: ['Admin'],
        });
    }

	/**
	 * 
	 * @param { Message } message 
	 * @returns 
	 */
	async messageRun(message) {
		return this.container.utility.errorReply(message, 'Command not ready');
	}
}

module.exports = { ResetAllMessagesCommand };