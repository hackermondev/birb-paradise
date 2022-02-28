const { SapphireClient } = require('@sapphire/framework');
const { prefix } = require('../config.json');
require('dotenv').config();

process.on('uncaughtException', error => { console.error(error); })

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'] });
client.options.defaultPrefix = prefix;

client.login(process.env.DISCORD_TOKEN);