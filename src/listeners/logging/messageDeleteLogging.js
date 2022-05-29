const { time, TimestampStyles } = require('@discordjs/builders');
const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
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
        if (!msgLogWebhookID || !msgLogWebhookToken) return;
        if (!this.container.utility.isBp(message.guild)) return;
        if (message.channel.parentId === '891307974948184114') return;
        if (!message.content) return;
        const msgDeleteEmbed = new MessageEmbed()
            .setTitle(`Message deleted by ${message.author.tag}`)
            .addField('Message', `${message.content}`)
            .addField('User', `<@${message.author.id}>`, true)
            .addField('Channel', `<#${message.channel.id}>`, true)
            .addField(
                'Time',
                time(message.createdAt, TimestampStyles.LongDateTime),
                true
            )
            .setColor('DARK_ORANGE');
        if (message.attachments.size > 0)
            msgDeleteEmbed.setImage(message.attachments.first().url);
        this.container.utility.sendWebhook(process.env.msgLogWebhookID, process.env.msgLogWebhookToken, msgDeleteEmbed);
    }
}

module.exports = { MessageDeleteLogging };
