const { Command, Args } = require('@sapphire/framework');
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
   * @param { Args } args
   */
  async messageRun(message, args) {
    const member = await args.pickResult('member');
    if (!member.success) return message.reply('Mention someone to bam').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    return message.reply('Command not ready');
  }
}

module.exports = { EmmieCommand };