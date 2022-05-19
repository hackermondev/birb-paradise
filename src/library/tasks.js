const { container } = require("@sapphire/pieces");

class Tasks {
    constructor() {
        this.startTasks();
        this.intervals = [];
    }

    /**
     * Starts all the bot's tasks
     */
    async startTasks() {
        this.startResetHourlyMessageLeaderboard();
        this.startResetDailyMessageLeaderboard();
        this.startResetWeeklyMessageLeaderboard();
    }

    async startResetHourlyMessageLeaderboard() {
        const i = setInterval(() => {
            const date = new Date();
            if (date.getUTCHours() === 4 && date.getUTCMinutes() === 0) {
                container.leaderboard.resetHourlyMessageCount();
            }
        }, 5000);
        this.intervals.push(i);
    }

    async startResetDailyMessageLeaderboard() {
        const i = setInterval(() => {
            const date = new Date();
            if (date.getUTCMinutes() === 0) {
                container.leaderboard.resetDailyMessageCount();
            }
        }, 5000);
        this.intervals.push(i);
    }

    async startResetWeeklyMessageLeaderboard() {
        const i = setInterval(() => {
            const date = new Date();
            if (date.getUTCDay() === 1 && date.getUTCHours() === 4 && date.getUTCMinutes() === 0) {
                container.leaderboard.resetWeeklyMessageCount();
            }
        }, 5000);
        this.intervals.push(i);
    }


}

module.exports = { Tasks };
