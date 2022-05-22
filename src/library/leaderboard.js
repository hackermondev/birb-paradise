const { container } = require('@sapphire/pieces');
const { MessageEmbed, Guild } = require('discord.js');
const LeaderboardType = {
    HOURLY: 'HOURLY',
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    ALL_TIME: 'ALLTIME',
};

class Leaderboard {
    /**
     *
     * @param { String } userID
     */
    async getAllTimeMessageCount(userID) {
        return container.redis.hget('messages_alltime', userID);
    }

    /**
     *
     * @param { String } userID
     */
    async getWeeklyMessageCount(userID) {
        return container.redis.hget('messages_weekly', userID);
    }

    /**
     *
     * @param { String } userID
     */
    async getDailyMessageCount(userID) {
        return container.redis.hget('messages_daily', userID);
    }

    /**
     *
     * @param { String } userID
     */
    async getHourlyMessageCount(userID) {
        return container.redis.hget('messages_hourly', userID);
    }

    /**
     *
     * @param { String } userID
     * @param { Number } count
     */
    async addAllTimeMessageCount(userID, count) {
        const currentMemberMsgs = await this.getAllTimeMessageCount(userID);

        const newMemberMsgs = currentMemberMsgs
            ? Number.parseInt(currentMemberMsgs) + count
            : count;

        await container.redis.hset('messages_alltime', userID, newMemberMsgs);
    }

    /**
     *
     * @param { String } userID
     * @param { Number } count
     */
    async addWeeklyMessageCount(userID, count) {
        const currentMemberMsgs = await this.getWeeklyMessageCount(userID);

        const newMemberMsgs = currentMemberMsgs
            ? Number.parseInt(currentMemberMsgs) + count
            : count;

        await container.redis.hset('messages_weekly', userID, newMemberMsgs);
    }

    /**
     *
     * @param { String } userID
     * @param { Number } count
     */
    async addDailyMessageCount(userID, count) {
        const currentMemberMsgs = await this.getDailyMessageCount(userID);

        const newMemberMsgs = currentMemberMsgs
            ? Number.parseInt(currentMemberMsgs) + count
            : count;

        await container.redis.hset('messages_daily', userID, newMemberMsgs);
    }

    /**
     *
     * @param { String } userID
     * @param { Number } count
     */
    async addHourlyMessageCount(userID, count) {
        const currentMemberMsgs = await this.getHourlyMessageCount(userID);

        const newMemberMsgs = currentMemberMsgs
            ? Number.parseInt(currentMemberMsgs) + count
            : count;

        await container.redis.hset('messages_hourly', userID, newMemberMsgs);
    }

    /**
     * Resets the hourly message count for the leaderboard
     */
    async resetHourlyMessageCount() {
        const data = await container.redis.hkeys('messages_hourly');
        for (var i = 0; i < data.length; ++i) {
            await container.redis.hdel('messages_hourly', data[i]);
        }
    }

    /**
     * Resets the daily message count for the leaderboard
     */
    async resetDailyMessageCount() {
        const data = await container.redis.hkeys('messages_daily');
        for (var i = 0; i < data.length; ++i) {
            await container.redis.hdel('messages_daily', data[i]);
        }
    }

    /**
     * Resets the weekly message count for the leaderboard
     */
    async resetWeeklyMessageCount() {
        const data = await container.redis.hkeys('messages_weekly');
        for (var i = 0; i < data.length; ++i) {
            await container.redis.hdel('messages_weekly', data[i]);
        }
    }

    /**
     * @param { LeaderboardType } type
     * @param { Guild } guild
     * @param { Number } limit
     */
    async constructLeaderboardEmbed(type, guild, limit) {
        const leaderboardEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({ text: guild.name });
        let allMessages;

        switch (type) {
            case 'HOURLY':
                allMessages = await container.redis.hgetall('message_hourly');
                leaderboardEmbed.setTitle('Hourly Message Leaderboard');
                break;
            case 'DAILY':
                leaderboardEmbed.setTitle('Daily Message Leaderboard');
                allMessages = await container.redis.hgetall('message_daily');
                break;
            case 'WEEKLY':
                leaderboardEmbed.setTitle('Weekly Message Leaderboard');
                allMessages = await container.redis.hgetall('message_weekly');
                break;
            case 'ALLTIME':
                leaderboardEmbed.setTitle('All Time Message Leaderboard');
                allMessages = await container.redis.hgetall('message_alltime');
                break;
            default:
                break;
        }
        const sorted = Object.entries(allMessages).sort((a, b) => b[1] - a[1]);

        const topTenMembers = sorted.map((entry) => entry[0]).slice(0, limit);
        const topTenMemberMessages = sorted
            .map((entry) => entry[1])
            .slice(0, 10);

        for (var i = 0; i < topTenMembers.length; ++i) {
            const user = await container.client.users
                .fetch(topTenMembers[i])
                .catch(() => null);
            if (!user) continue;
            leaderboardEmbed.addField(
                user.tag,
                `Messages: ${topTenMemberMessages[i]}`,
                true
            );
        }

        if (!leaderboardEmbed.fields.length)
            leaderboardEmbed.setDescription(
                'No members are currently on the leaderboard'
            );

        return leaderboardEmbed;
    }
}

module.exports = { Leaderboard, LeaderboardType };
