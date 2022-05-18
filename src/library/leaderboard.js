class Leaderboard {
    /**
     *
     * @param { String } userID
     */
    async getMessageCount(userID) {
        return container.redis.hget('messages', userID);
    }

    /**
     *
     * @param { String } userID
     * @param { Number } count
     */
    async addMessageCount(userID, count) {
        const currentMemberMsgs = await this.getMessageCount(userID);

        const newMemberMsgs = currentMemberMsgs
            ? Number.parseInt(currentMemberMsgs) + count
            : count;

        await container.redis.hset('messages', userID, newMemberMsgs);
    }
}

module.exports = { Leaderboard };
