const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
class MessageEditListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: Events.MessageUpdate,
            event: Events.MessageUpdate,
        });
    }

    /**
     *
     * @param { Message } oldMessage
     * @param { Message } newMessage
     */
    async run(oldMessage, newMessage) {
        await this.logEdit(oldMessage, newMessage);
    }

    async logEdit(oldMessage, newMessage) {
        if (!this.container.utility.isBp(oldMessage.guild)) return;
        if (!process.env.msgLogWebhookID || !process.env.msgLogWebhookToken)
            return;
        if (oldMessage.channel.parentId === '891307974948184114') return;
        if (!oldMessage.content || !newMessage.content) return;
        const msgDeleteEmbed = new MessageEmbed()
            .setTitle(`Message edited by ${oldMessage.author.tag}`)
            .addField('Old Message', `${oldMessage.content}`)
            .addField('New Message', `${newMessage.content}`)
            .addField('User', `<@${oldMessage.author.id}>`, true)
            .addField('Channel', `<#${oldMessage.channel.id}>`, true)
            .addField('Time', `<t:${Math.round(Date.now() / 1000)}>`, true)
            .setColor('DARK_PURPLE');
        this.container.utility.sendWebhook(
            process.env.msgLogWebhookID,
            process.env.msgLogWebhookToken,
            msgDeleteEmbed
        );
    }
}

module.exports = { MessageEditListener };
