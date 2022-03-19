const { SapphireClient } = require('@sapphire/framework');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
require('@sapphire/plugin-logger/register');
require('dotenv').config();
const { prefix } = require('../config.json');
const sentryDSN = process.env.SENTRY_DSN;

process.on('uncaughtException', (error) => {
    const sentryID = Sentry.captureException(error);
    client.logger.error(
        `Uncaught exception with ID ${sentryID} sent to Sentry`
    );
});

process.on('exit', (code) => {
    client.logger.warn(`Process exiting with code ${code}...`);
});

const client = new SapphireClient({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS'],
});
client.options.defaultPrefix = prefix;

Sentry.init({
    dsn: process.env.sentryDSN,
    tracesSampleRate: 1.0,
    release: `${require('../package.json').name}@${
        require('../package.json').version
    }`,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

client.login(process.env.DISCORD_TOKEN);
