const { Command } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../../../config.json');

class PrefixCommand extends Command {
	constructor(context, options) {
    super(context, {
      ...options,
      name: 'prefix',
      aliases: ['currentprefix', 'commandprefix'],
      description: 'Gets you the prefix of the bot',
      preconditions: ['Staff']
    });
  }

  /**
   * 
   * @param { Message } message 
   */
  messageRun(message) {
    return message.reply({embeds: [new MessageEmbed().setDescription(`My current prefix is \`${prefix}\``).setColor('DARK_AQUA')]});
  }
}