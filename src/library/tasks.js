const { container } = require('@sapphire/pieces');

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
}

module.exports = { Tasks };
