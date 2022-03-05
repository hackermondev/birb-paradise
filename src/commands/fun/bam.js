const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class EmmieCommand extends Command {
	constructor(context, options) {
		super(context, {
		...options,
		name: 'bam',
		aliases: ['bam'],
		description: 'Definitely bans you from the server',
		preconditions: ['Staff']
	});
	}

  /**
   * 
   * @param { Message } message 
   */
  messageRun(message) {
    return message.reply('Command not ready');
  }
}

module.exports = { EmmieCommand };