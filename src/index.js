const { SapphireClient, container } = require('@sapphire/framework');
const { Options, Intents } = require('discord.js');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const Redis = require('ioredis');
require('@sapphire/plugin-logger/register');
require('dotenv').config();
const { prefix } = require('../config.json');
const { Utility } = require('./library/utility');
const sentryDSN = process.env.SENTRY_DSN;
const { Octokit } = require('@octokit/core');
const octokit = new Octokit({ auth: process.env.OCTOKIT_AUTH });

process.on('uncaughtException', (error) => {
    console.log(error);
    container.utility.sendException(error, 'Uncaught');
});

process.on('exit', (code) => {
    client.logger.info(
        `Process exiting with code ${code}...(A restart signal was probably sent)`
    );
});

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PWD,
});
// container.logger.info('Connected to redis!');

container.redis = redis;
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

async function getLastCommitSha() {
    let returnValue = await octokit.request('GET /repos/{owner}/{repo}/commits/master', {
        owner: 'birb-paradise',
        repo: 'birb-helper',
    });
    if (returnValue.status !== 200) return null;
    else return returnValue.data.sha;
}

var lastCommitSha;
(async () => { lastCommitSha = await getLastCommitSha(); })();
setInterval(() => {
    var sha;
    (async () => { sha = await getLastCommitSha(); })();
    container.logger.debug('sha: ' + sha);
    if (sha && sha !== lastCommitSha) {
        container.logger.warn('New release was detected..Updating bot');
        return process.exit();
    }
}, 3000);

client.login(process.env.DISCORD_TOKEN);
