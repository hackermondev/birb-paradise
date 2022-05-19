const { container } = require('@sapphire/pieces');

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
}

module.exports = { Leaderboard };
