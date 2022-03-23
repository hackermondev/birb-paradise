const { SapphireClient, container } = require('@sapphire/framework');
const { Options } = require('discord.js');
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
    client.logger.warn(
        `Process exiting with code ${code}...(A restart signal was probably sent)`
    );
});

const client = new SapphireClient({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS'],
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
    },
});
container.utility = new Utility();
Sentry.init({
    dsn: sentryDSN,
    tracesSampleRate: 1.0,
    release: `${require('../package.json').name}@${
        require('../package.json').version
    }`,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

client.login(process.env.DISCORD_TOKEN);
