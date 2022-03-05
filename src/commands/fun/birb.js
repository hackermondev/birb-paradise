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
    return message.reply('https://tenor.com/view/bird-roosting-roost-parakeet-birds-gif-16250811');
  }
}

module.exports = { EmmieCommand };