const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { Duration } = require('@sapphire/time-utilities');

class TimeoutCommand extends Command {
	constructor(context, options) {
    super(context, {
      ...options,
      name: 'timeout',
      preconditions: ['Staff'],
      description: 'Times out someone in the server'
    });
  }

  /**
   * 
   * @param { Message } message 
   * @param { Args } args 
   */
  async messageRun(message, args) {
    return message.reply('Command isn\'t ready yet');
    const rawArgs = await args.restResult('string');
    if (!rawArgs.success) return message.reply('Mention someone to timeout').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    const actionMember = await args.pickResult('member');
    const rawActionTime = await args.pickResult('string');
    actionTime.
    if (!actionMember.success) return message.reply('Mention a valid user to timeout').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));

  }
}

module.exports = { TimeoutCommand };