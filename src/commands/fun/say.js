const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class SayCommand extends Command {
	constructor(context, options) {
		super(context, {
		...options,
		name: 'say',
		aliases: [],
		description: 'idk you can say something',
		preconditions: ['Admin']
	});
	}

  /**
   * 
   * @param { Message } message 
   * @param { Args } args
   */
  async messageRun(message, args) {
    const whatToSay = await args.restResult('string');
    if (!whatToSay.success) return message.reply('You need to tell me what to say smh').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    if (whatToSay.value.length > 100) return message.reply('Why is your message so long').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    await message.channel.send(whatToSay.value);
    return message.delete();
  }
}

module.exports = { SayCommand };