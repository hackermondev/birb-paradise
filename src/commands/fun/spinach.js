const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class SpinachCommand extends Command {
	constructor(context, options) {
		super(context, {
		...options,
		name: 'spinach',
		description: 'spinach is cool',
		preconditions: ['Staff']
	});
	}

  /**
   * 
   * @param { Message } message 
   */
  messageRun(message) {
    return message.reply(`yru'oe* spinach is best than all u nobs`);
  }
}

module.exports = { SpinachCommand };