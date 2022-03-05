const { Command } = require('@sapphire/framework');

class RestartCommand extends Command {
	constructor(context, options) {
    super(context, {
      ...options,
      name: 'restart',
      aliases: ['reboot'],
      preconditions: ['Staff'],
      description: 'Restarts Birb Helper'
    });
  }

  messageRun(message) {
	  message.reply('The bot is restarting...');
    return process.exit();
  }
}

module.exports = { RestartCommand };