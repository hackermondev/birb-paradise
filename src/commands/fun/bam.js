const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');

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
    const rawMember = await args.pickResult('member');
    if (!rawMember.success) return message.reply('Mention someone to bam').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    const member = rawMember.value;
    return message.reply({embeds: [new MessageEmbed().setDescription(`<@${member.id}> has been bammed by <@${message.author.id}>`).setColor('DARK_RED')]});
  }
}

module.exports = { EmmieCommand };