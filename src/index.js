const { SapphireClient, container } = require('@sapphire/framework');
const { Options, Intents } = require('discord.js');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
require('@sapphire/plugin-logger/register');
require('dotenv').config();
const { prefix } = require('../config.json');
const { Utility } = require('./library/utility');
const sentryDSN = process.env.SENTRY_DSN;

process.on('uncaughtException', (error) => {
    container.utility.sendException(error, 'Uncaught');
});

process.on('exit', (code) => {
    client.logger.info(
        `Process exiting with code ${code}...(A restart signal was probably sent)`
    );
});

container.utility = new Utility();

const client = new SapphireClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
    ],
    defaultPrefix: prefix,
    loadMessageCommandListeners: true,
    caseInsensitiveCommands: true,
    caseInsensitivePrefixes: true,
    loadDefaultErrorListeners: false,
    sweepers: {
        ...Options.defaultSweeperSettings,
        guildMembers: {
            interval: 500,
            filter: () => (m) => m.id != '925829323762577479',
        },
        users: {
            interval: 500,
            filter: () => (m) => m.id != '925829323762577479',
        },
    },
});

Sentry.init({
    dsn: sentryDSN,
    tracesSampleRate: 1.0,
    release: `${require('../package.json').name}@${
        require('../package.json').version
    }`,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

client.login(process.env.DISCORD_TOKEN);
