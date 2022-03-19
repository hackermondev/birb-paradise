const { SapphireClient } = require('@sapphire/framework');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
require('@sapphire/plugin-logger/register');
const { prefix } = require('../config.json');
const { DISCORD_TOKEN } = require('../config.json');

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
    dsn: 'https://b96f5bab3c2e407db829c97a9e73abe5@o1170791.ingest.sentry.io/6264651',
    tracesSampleRate: 1.0,
    release: `${require('../package.json').name}@${
        require('../package.json').version
    }`,
});

client.login(process.env.DISCORD_TOKEN);
