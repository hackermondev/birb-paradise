const { Client, Intents, MessageReaction, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const fs = require('fs');
const { prefix } = require('../config.json');
require('dotenv').config();

client.once('ready', () => {
	console.log(`\nLogged in as ${client.user.tag}!`);
	client.user.setActivity('development go brr', { type: 'WATCHING'});
});

process.on('uncaughtException', error => { console.error(error); })

