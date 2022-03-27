const { Listener, Events } = require('@sapphire/framework');
const { Client } = require('discord.js');
const { container } = require('@sapphire/framework');
const activities = [
    `a partnered server`,
    `people level up`,
    `Birb Paradise`,
];
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
            `Ping acknowledged by the API. Bot is online.\n\n`
        );
        setInterval(() => {
            container.logger.info(
                `Pinging...Ping acknowledged by the API. Latency is ${client.ws.ping} ms.\n\n`
            );
        }, 600000);
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
