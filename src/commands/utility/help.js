const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../../../config.json');
class HelpCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'help',
      aliases: ['cmds'],
      description: 'Shows you all the commands on the bot',
      preconditions: []
    });
  }

  /**
   * 
   * @param { Message } message 
   * @param { Args } args
   * @returns 
   */
  async messageRun(message, args) {
	const commandsData = [];
	const commands = this.container.stores.get('commands');
	const command = await args.pickResult('string');
		
	if (!command.success) {
		commands.filter((cmd) => cmd.name != 'eval').forEach(cmd => commandsData.push(`\`${cmd.name}\``));
		// TODO: finish improving help and making it more fancy
		// const helpEmbed = new MessageEmbed()
		// 	.setColor('BLUE')
		// 	.setTitle('Help')
		// 	.setFooter({text: `${this.container.stores.get('commands').size - 1} total commands. Use ${prefix}help [command] to get information on a specific command`});
		// TODO: finish working on help
		// let categories = [];
		// for (var x = 0; x < this.container.stores.get('commands').categories.length; x++) {
		// 	helpEmbed.
		// }
		
		// for (var x = 0; x < commandsData.length; x++) {
			
		// }
		const helpEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle('Commands')
			.setDescription(`${commandsData.toString()}`)
			.setFooter({text: `${this.container.stores.get('commands').size - 1} total commands. Use ${prefix}help [command] to get information on a specific command`})
		return message.reply({embeds: [helpEmbed]});
	}

	let cmd = null;
	if (!this.container.stores.get('commands').get(command.value)) {
		return message.reply(`No help found for command \`${command.name}\``);
	}
	else {
		cmd = this.container.stores.get('commands').get(command.value);
	}
	commandsData.push(`**Name:** ${cmd.name}\n`);

	if (cmd.aliases) commandsData.push(` **Aliases:** ${cmd.aliases.join(', ')}\n`);
	if (cmd.description) commandsData.push(` **Description:** ${cmd.description}\n`);
	if (cmd.usage) commandsData.push(` **Usage:** ${cmd.usage}\n`);
	const commandsDataString = commandsData.join(' ');
	const commandHelpEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle(`Information for ${cmd.name}`)
			.setDescription(`${commandsDataString}`)
	return message.reply({embeds: [commandHelpEmbed]});
  }
}

module.exports = { HelpCommand };