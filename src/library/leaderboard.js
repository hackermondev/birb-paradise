const { container } = require("@sapphire/pieces");

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
}

module.exports = { Leaderboard };
