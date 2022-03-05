const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { rules } = require('../../../config.json');

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
  }
}

module.exports = { RuleCommand }