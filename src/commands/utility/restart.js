const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class RestartCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'restart',
            aliases: ['reboot'],
            preconditions: ['Staff'],
            description: 'Restarts Birb Helper',
        });
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async messageRun(message) {
        await message.reply(
            "The bot is restarting... (You can check the bot's status to see when it has restarted)"
        );
        this.container.logger.warn(
            `Restart signal sent by ${message.member.user.tag}`
        );
        this.container.client.user.setActivity('Restarting..');
        return process.exit();
    }
}

module.exports = { RestartCommand };
