const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class BirbCommand extends Command {
	constructor(context, options) {
		super(context, {
		...options,
		name: 'birb',
		description: 'birb',
		preconditions: ['Staff']
	});
	}

  /**
   * 
   * @param { Message } message 
   */
  messageRun(message) {
    const birb_images = ['']
    return message.reply('Command isn\'t ready yet');
  }
}

module.exports = { BirbCommand };