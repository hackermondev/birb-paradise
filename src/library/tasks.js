const { container } = require('@sapphire/pieces');
const { TextChannel, Guild } = require('discord.js');
const { LeaderboardType } = require('./leaderboard');
const { leaderboardChannel } = require('../../config.json');

class Tasks {
    constructor() {
        this.intervals = [];
        this.startTasks().then(() => {
            container.logger.info('All tasks successfully started.');
        });
    }

    /**
     * Starts all the bot's tasks
     */
    async startTasks() {
        this.startResetHourlyMessageLeaderboard();
        this.startResetDailyMessageLeaderboard();
        this.startResetWeeklyMessageLeaderboard();
        this.startPostLeaderboards(container.client.channels.cache.get(leaderboardChannel), container.client.guilds.cache.get('891286303574994974'))

    }

    /**
     * Forcefully stops all running tasks
     */
    async stopTasks() {
        for (const i of this.intervals) {
            clearInterval(i);
        }
    }

    /**
     * Starts the reset hourly message leaderboard task
     */
    async startResetHourlyMessageLeaderboard() {
        const i = setInterval(() => {
            const date = new Date();
            if (date.getUTCMinutes() === 0) {
                container.leaderboard.resetHourlyMessageCount();
                container.logger.debug('Reset hourly message leaderboard');
            }
        }, 5000);
        this.intervals.push(i);
    }

    /**
     * Starts the reset daily message leaderboard task
     */
    async startResetDailyMessageLeaderboard() {
        const i = setInterval(() => {
            const date = new Date();
            if (date.getUTCHours() === 4 && date.getUTCMinutes() === 0) {
                container.leaderboard.resetDailyMessageCount();
                container.logger.debug('Reset daily message leaderboard');
            }
        }, 5000);
        this.intervals.push(i);
    }
    /**
     * Starts the reset weekly message leaderboard task
     */
    async startResetWeeklyMessageLeaderboard() {
        const i = setInterval(() => {
            const date = new Date();
            if (
                date.getUTCDay() === 1 &&
                date.getUTCHours() === 4 &&
                date.getUTCMinutes() === 0
            ) {
                container.leaderboard.resetWeeklyMessageCount();
                container.logger.debug('Reset weekly message leaderboard');
            }
        }, 5000);
        this.intervals.push(i);
    }

    /**
     * 
     * @param { TextChannel } channel 
     * @param { Guild } guild 
     */
    async startPostLeaderboards(channel, guild) {
        const i = setInterval(async() => {
            const date = new Date();
            if (date.getUTCMinutes() === 59) {
                const embeds = await this.getAllLeaderboardEmbeds(guild);
                channel.bulkDelete(1);
                channel.send({embeds: [embeds]});
            }
        }, 5000);
        this.intervals.push(i);
    }

    /**
     * 
     * @param { Guild } guild 
     */
    async getAllLeaderboardEmbeds(guild) {
        const hourly = await container.leaderboard.constructLeaderboardEmbed(LeaderboardType.HOURLY, guild, 10);
        const daily = await container.leaderboard.constructLeaderboardEmbed(LeaderboardType.DAILY, guild, 10);
        const weekly = await container.leaderboard.constructLeaderboardEmbed(LeaderboardType.WEEKLY, guild, 10);
        const alltime = await container.leaderboard.constructLeaderboardEmbed(LeaderboardType.ALL_TIME, guild, 10);

        return [hourly, daily, weekly, alltime];
    }
}

module.exports = { Tasks };
