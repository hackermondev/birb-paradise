const { SapphireClient } = require('@sapphire/framework');
const { prefix } = require('../config.json');
const { DISCORD_TOKEN } = require('../config.json');

process.on('uncaughtException', error => { console.error(error); })

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS'] });
client.options.defaultPrefix = prefix;

client.login(DISCORD_TOKEN);