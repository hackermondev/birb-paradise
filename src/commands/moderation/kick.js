const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class KickCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'kick',
      aliases: ['k'],
      description: 'Kicks a member from the server',
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
    return message.reply('Command isn\'t ready yet');
    const member = args.pickResult('member');
  }
}