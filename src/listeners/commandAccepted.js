const { Listener, Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class CommandAcceptedListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'commandAccepted',
      once: false,
      event: 'commandAccepted'
    });
  }

  /**
   * 
   * @param { Message } message 
   * @param { Command } command 
   */
  run(message, command ) {
    this.container.logger.info(`Command ${command.name} ran by ${message.member.user.tag}`)
  }
}

module.exports = { CommandAcceptedListener }