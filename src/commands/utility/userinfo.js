const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');

class UserInfoCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'userinfo',
      aliases: ['user'],
      description: 'Shows you the details of a user',
      preconditions: ['Staff']
    });
  }

  /**
   * 
   * @param { Message } message 
   * @param { Args } args
   * @returns 
   */
  async messageRun(message, args) {
    return message.reply('Command not ready').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    const userInfoEmbed = new MessageEmbed()
  }
}

module.exports = { UserInfoCommand };