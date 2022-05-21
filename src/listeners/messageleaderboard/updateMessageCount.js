const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');

class UpdateMessageCountListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'updateMessageCount',
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (message.author.bot) return;
        if (message.channel.type !== 'GUILD_TEXT') return;
        if (!this.container.utility.isBp(message.guild)) return;
        if (!message.member) return;

        if (message.content.length) {
            const spamAnalyzed = await this.container.perspective.analyzeSpam(
                message.content
            );
            if (spamAnalyzed > 0.5) return; // if message is spam do not add it to the message count
        }

        await this.container.leaderboard.addAllTimeMessageCount(
            message.member.id,
            1
        );
        await this.container.leaderboard.addWeeklyMessageCount(
            message.member.id,
            1
        );
        await this.container.leaderboard.addDailyMessageCount(
            message.member.id,
            1
        );
        await this.container.leaderboard.addHourlyMessageCount(
            message.member.id,
            1
        );
    }
}

module.exports = { UpdateMessageCountListener };
