const { SapphireClient, container, LogLevel } = require('@sapphire/framework');
const { Options, Intents } = require('discord.js');
const Sentry = require('@sentry/node');
const Redis = require('ioredis');
require('@sapphire/plugin-logger/register');
require('dotenv').config();
const { prefix } = require('../config.json');
const { Utility } = require('./library/utility');
const { Economy } = require('./library/economy');
const { Perspective } = require('./library/perspective');
const { Leaderboard } = require('./library/leaderboard');
const { Tasks } = require('./library/tasks');

process.on('uncaughtException', (error) => {
    console.log(error);
    container.utility.sendException(error, 'Uncaught');
});

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PWD,
});

container.redis = redis;
container.utility = new Utility();

container.redis?.on('connect', () => {
    container.logger.info('Connected to redis!');
});

container.utility = new Utility();
container.perspective = new Perspective(process.env.PERSPECTIVE_API_KEY);
container.leaderboard = new Leaderboard();
container.tasks = new Tasks();

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
            interval: 1000,
            filter: () => (m) => m.id != '925829323762577479',
        },
        users: {
            interval: 1000,
            filter: () => (m) => m.id != '925829323762577479',
        },
    },
    logger: { level: LogLevel.Debug },
});

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

container.economy = new Economy();
require('./library/cron-jobs');

client.login(process.env.DISCORD_TOKEN);
