const { SapphireClient } = require('@sapphire/framework');
require('dotenv').config();

process.on('uncaughtException', error => { console.error(error); })

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'] });

client.login(process.env.DISCORD_TOKEN);