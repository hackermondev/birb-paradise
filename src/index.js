const { Client, Intents, MessageReaction, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const fs = require('fs');
const { prefix } = require('../config.json');
require('dotenv').config();

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
		console.log(`Loaded command ${command.name}`);
	}
}

client.once('ready', () => {
	console.log(`\nLogged in as ${client.user.tag}!`);
	client.user.setActivity('development go brr', { type: 'WATCHING'});
});

process.on('uncaughtException', error => { console.error(error); })

client.on('messageCreate', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (command.permissions) {
		const authorPerms = ""; // TODO
	}
	try {
		command.execute(client, message, args);
	}
	catch (error) {
		console.log(error);
		message.reply('There was an error executing that command');
	}
})

client.login(process.env.DISCORD_TOKEN);