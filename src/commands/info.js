const { Command } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
class InfoCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'info',
      aliases: ['stats'],
      description: 'Gets you information about the bot'
    });
  }

  /**
   * 
   * @param { Message } message 
   * @returns 
   */
  async messageRun(message) {
	const info = new MessageEmbed()
		.setTitle('Bot Details')
		.setFooter({text: `${this.container.client.user.tag}`})
		.setColor('RANDOM')
		.addField('Memory Usage', `\`${process.memoryUsage.rss() / 1024 / 1024} MiB\``, true)
		.addField('Users Cached', `${this.container.client.users.cache.size}`, true)
		.addField('Uptime', `${humanize(this.container.client.uptime)}`)
		.addField('Commands', `${this.container.stores.get('commands').size}`, true)
	return message.reply({embeds: [info]});
  }
}

module.exports = { InfoCommand };