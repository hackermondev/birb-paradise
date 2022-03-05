const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');

class SlowmodeCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'slowmode',
      preconditions: ['Staff'],
      description: 'Changes (or checks) the slowmode of a channel'
    });
  }
  
  /**
   * 
   * @param { Message } message 
   * @param { Args } args 
   * @returns 
   */
  async messageRun(message, args) {
    return message.reply('Command not ready');
    const number = args.pickResult('number');
    if (!number.success) return message.reply(`The current slowmode in this channel is ${message.channel.rateLimitPerUser} seconds`);
  }
}

module.exports = { SlowmodeCommand }