const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { DurationFormatter } = require('@sapphire/time-utilities');

class SlowmodeCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'slowmode',
      aliases: 'slow',
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
    const number = await args.pickResult('number');
    const formatter = new DurationFormatter();
    if (!number.success) return message.reply(`The current slowmode in this channel is ${formatter.format(message.channel.rateLimitPerUser * 1000)}`);
    message.channel.setRateLimitPerUser(number.value);
    return message.reply(`Set the slowmode in this channel to ${formatter.format(number.value * 1000)}`);
  }
}

module.exports = { SlowmodeCommand }