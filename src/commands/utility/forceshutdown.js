const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class ForceShutdownCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'forceshutdown',
            preconditions: ['Admin'],
            description: "Forcefully shuts down Birb Helper in the event of an issue(it won't restart).",
        });
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async messageRun(message) {
        await message.channel.send(
            'Shutting down...(You will be able to see that the bot is shutdown as it will go offline)'
        );
        this.container.logger.warn(
            `Force shutdown signal sent by ${message.member.user.tag}`
        );
        this.container.client.destroy();
        return this.container.logger.info('Client destroyed.');
    }
}

module.exports = { ForceShutdownCommand };
