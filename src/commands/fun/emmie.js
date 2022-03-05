const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class EmmieCommand extends Command {
	constructor(context, options) {
		super(context, {
		...options,
		name: 'emmie',
		description: 'idk its the birb',
		preconditions: ['Staff']
	});
	}

  /**
   * 
   * @param { Message } message 
   */
  messageRun(message) {
    return message.reply('https://tenor.com/view/bird-roosting-roost-parakeet-birds-gif-16250811');
  }
}

module.exports = { EmmieCommand };