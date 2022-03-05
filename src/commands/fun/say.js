const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class SayCommand extends Command {
	constructor(context, options) {
		super(context, {
		...options,
		name: 'emmie',
		aliases: ['birb'],
		description: 'idk its the birb',
		preconditions: ['Staff']
	});
	}

  /**
   * 
   * @param { Message } message 
   * @param { Args } args
   */
  async messageRun(message, args) {
    const whatToSay = await args.pickResult('string');
    if (!whatToSay.success) return message.reply('You need to tell me what to say smh').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    message.delete();
    message.channel.send(whatToSay.value);
  }
}

module.exports = { SayCommand };