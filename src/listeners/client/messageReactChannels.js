const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { reactChannels } = require('../../../config.json');

class MessageReactBarneySuggestions extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'messageReactChannels',
            once: false,
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!reactChannels.includes(message.channelId)) return;
        if (message.author.id === message.guild.ownerId) return;
        return message
            .react('👍')
            .then(message.react('👎'))
            .catch((e) => this.container.logger.error(e));
    }
}

module.exports = { MessageReactBarneySuggestions };
