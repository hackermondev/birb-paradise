const { Listener, Events } = require('@sapphire/framework');
const { Client } = require('discord.js');
const { container } = require('@sapphire/framework');
const activities = [
    `"a partnered server", { type: "WATCHING" }`,
    `"people level up", { type: "WATCHING" }`,
    `"Birb Paradise", { type: "WATCHING" }`,
];
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
            container.logger.info(`Pinging...`);
            const wsPing = client.ws.ping;
            container.logger.info(
                `Ping acknowledged by the API. Latency is ${wsPing} ms.\n\n`
            );
        }, 400000);

        setInterval(() => {
            activityIndex++;
            if (activityIndex >= activities.length) activityIndex = 0;
            eval(
                `this.container.client.user.setActivity(${activities[activityIndex]})`
            );
        }, 30000);
    }
}

module.exports = { ReadyListener };
