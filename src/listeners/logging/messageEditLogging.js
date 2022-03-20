const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed, WebhookClient } = require('discord.js');
const { bpGuildID } = require('../../../config.json');
const msgLogWebhookID = process.env.msgLogWebhookID;
const msgLogWebhookToken = process.env.msgLogWebhookToken;
class MessageEditLogging extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.MessageUpdate,
        });
    }

    /**
     *
     * @param { Message } oldMessage
     * @param { Message } newMessage
     */
    async run(oldMessage, newMessage) {
        if (oldMessage.guildId !== bpGuildID) return;
        if (oldMessage.channel.parentId === '891307974948184114') return;
        if (!oldMessage.content || !newMessage.content) return; // TODO add support for image logging and other types of messages
        const webhookClient = new WebhookClient({
            id: msgLogWebhookID,
            token: msgLogWebhookToken,
        });
        const msgDeleteEmbed = new MessageEmbed()
            .setTitle(`Message edited by ${oldMessage.author.tag}`)
            .addField('Old Message', `${oldMessage.content}`)
            .addField('New Message', `${newMessage.content}`)
            .addField('User', `<@${oldMessage.author.id}>`, true)
            .addField('Channel', `<#${oldMessage.channel.id}>`, true)
            .addField('Time', `<t:${Math.round(Date.now() / 1000)}>`, true)
            .setColor('DARK_PURPLE');
        webhookClient.send({
            embeds: [msgDeleteEmbed],
        });
    }
}

module.exports = { MessageEditLogging };
