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

        // TODO: check for spam

        this.container.utility.addMessageCount(message.member.id, 1);
    }
}

module.exports = { UpdateMessageCountListener };
