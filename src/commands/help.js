const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');
class HelpCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'help',
      aliases: ['cmds'],
      description: 'Shows you all the commands on the bot',
      preconditions: ['Staff']
    });
  }

  /**
   * 
   * @param { Message } message 
   * @returns 
   */
  async messageRun(message) {
	
  }
}

module.exports = {
  PingCommand
};