const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');
class MessageReactChannelsListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'messageReactChannels',
            event: Events.MessageCreate,
            enabled: false,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!this.container.utility.isBp(message.guild) || message.author.bot)
            return;
        if (!this.container.utility.isReactChannel(message.channel)) return;
        if (message.author.id === message.guild.ownerId) return;
        return message
            .react('👍')
            .then(message.react('👎'))
            .catch((e) => this.container.logger.error(e));
    }
}

module.exports = { MessageReactChannelsListener };
