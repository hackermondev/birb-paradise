const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { reactChannels, bpGuildID } = require('../../../config.json');

class MessageReactChannelsListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'messageReactChannels',
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (message.guild.id !== bpGuildID || message.author.bot) return;
        if (!reactChannels.includes(message.channelId)) return;
        if (message.author.id === message.guild.ownerId) return;
        return message
            .react('👍')
            .then(message.react('👎'))
            .catch((e) => this.container.logger.error(e));
    }
}

module.exports = { MessageReactChannelsListener };
