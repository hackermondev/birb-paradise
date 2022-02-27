const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	aliases: ['allcommands'],
	description: 'Shows you all the commands on the bot',
	usage: '>help',
	
	async execute(client, message, args) {
		const commandsData = [];
		const { commands } = message.client;
		if (!client.application.owner) await client.application.fetch();

		if (!args.length) {
			commands.filter((cmd) => cmd.name != 'eval').forEach(cmd => commandsData.push(`\`${cmd.name}\``));
			const helpEmbed = new MessageEmbed()
				.setColor('BLUE')
				.setTitle('Commands')
				.setDescription(`${commandsData.toString()}`)
				.setFooter({text: `${client.commands.size - 1} total commands. Use ${prefix}help [command] to get information on a specific command`})
			return message.reply({embeds: [helpEmbed]});
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply(`No help found for command \`${command.name}\``);
		}
		else if ((command.name == eval) && (message.author != client.application.owner)) {
			return message.reply(`This command is too cool for you to get help on`);
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
	},
}