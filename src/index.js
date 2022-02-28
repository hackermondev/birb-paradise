const { SapphireClient } = require('@sapphire/framework');
require('dotenv').config();

process.on('uncaughtException', error => { console.error(error); })

const client = new SapphireClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.login(process.env.DISCORD_TOKEN);