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
	const command = args.pickResult('string');
		
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

	if (!command) {
		return message.reply(`No help found for command \`${command.name}\``);
	}

	commandsData.push(`**Name:** ${command.name}\n`);

	if (command.aliases) commandsData.push(` **Aliases:** ${command.aliases.join(', ')}\n`);
	if (command.description) commandsData.push(` **Description:** ${command.description}\n`);
	if (command.usage) commandsData.push(` **Usage:** ${command.usage}\n`);
	const commandsDataString = commandsData.join(' ');
	const commandHelpEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle(`Information for ${command.name}`)
			.setDescription(`${commandsDataString}`)
	return message.reply({embeds: [commandHelpEmbed]});
  }
}

module.exports = { HelpCommand };