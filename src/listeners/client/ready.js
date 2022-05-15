const { Listener, Events } = require('@sapphire/framework');
const { DurationFormatter } = require('@sapphire/time-utilities');
const { Client } = require('discord.js');
const { container } = require('@sapphire/framework');
const activities = [`a partnered server`, `people level up`, `Birb Paradise`];
const activitiesTypes = ['WATCHING', 'WATCHING', 'WATCHING'];
let activityIndex = 0;
class ReadyListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true,
            event: Events.ClientReady,
        });
    }

    /**
     *
     * @param { Client } client
     */
    async run(client) {
        this.container.logger.info(`Logged in as ${client.user.tag}!`);
        this.container.logger.info(`Pinging...`);
        this.container.logger.info(
            `Ping acknowledged by the API. ${client.ws.ping} ms. Bot is online.\n\n`
        );

        const hasRebooted = await this.container.redis.hget('tasks', 'restart');
        if (hasRebooted) {
            const [channelID, restartTime] = hasRebooted.split(':');
            this.container.client.channels.cache.get(channelID).send(`The bot restarted successfully in ${new DurationFormatter().format(Date.now() - restartTime)}`);
            await this.container.redis.hdel('tasks', 'restart');
        }

        this.container.client.user.setActivity(`${activities[0]}`, {
            type: `${activitiesTypes[0]}`,
        });
        activityIndex++;

        setInterval(() => {
            activityIndex++;
            if (activityIndex >= activities.length) activityIndex = 0;
            this.container.client.user.setActivity(
                `${activities[activityIndex]}`,
                { type: `${activitiesTypes[activityIndex]}` }
            );
        }, 25000);
    }
}

module.exports = { ReadyListener };
