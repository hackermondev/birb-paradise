const { SapphireClient, container } = require('@sapphire/framework');
const { Options, Intents } = require('discord.js');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const redis = require('redis');
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

// redis listeners
redisClient.on('connect', () => {
    client.logger.info('Connected to redis');
});

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PWD
});
redisClient.connect();

container.redis = redisClient;
container.utility = new Utility();

const client = new SapphireClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
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
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

client.login(process.env.DISCORD_TOKEN);
