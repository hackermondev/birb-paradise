const { time, TimestampStyles } = require('@discordjs/builders');
const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed, WebhookClient } = require('discord.js');
const msgLogWebhookID = process.env.msgLogWebhookID;
const msgLogWebhookToken = process.env.msgLogWebhookToken;

class MessageDeleteLogging extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.MessageDelete,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!this.container.utility.isBp(message.guild)) return;
        if (message.channel.parentId === '891307974948184114') return;
        if (!message.content) return; // TODO add support for image logging and other types of messages
        const webhookClient = new WebhookClient({
            id: msgLogWebhookID,
            token: msgLogWebhookToken,
        });
        const msgDeleteEmbed = new MessageEmbed()
            .setTitle(`Message deleted by ${message.author.tag}`)
            .addField('Message', `${message.content}`)
            .addField('User', `<@${message.author.id}>`, true)
            .addField('Channel', `<#${message.channel.id}>`, true)
            .addField('Time', time(message.createdAt, TimestampStyles.LongDateTime), true)
            .setColor('DARK_ORANGE');
        if (message.attachments.size > 0) msgDeleteEmbed.setImage(message.attachments.first().url);
        webhookClient.send({
            embeds: [msgDeleteEmbed],
        });
    }
}

module.exports = { MessageDeleteLogging };
