const { Listener, Events } = require('@sapphire/framework');
const { Message, WebhookClient, MessageEmbed } = require('discord.js');
const { staffRoles, gifPermRoles } = require('../../../config.json');
const automodLogsWebhookID = process.env.automodLogsWebhookID;
const automodLogsWebhookToken = process.env.automodLogsWebhookToken;
const linkRegex = new RegExp();

class LinkAutomodListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'linkAutomod',
            once: false,
            event: Events.MessageCreate,
            enabled: false,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!message.guild) return;
        if (message.author === this.container.client.user || message.author.bot)
            return;
        if (staffRoles.some((role) => message.member.roles.cache.has(role)))
            return;

        if (!tenorDomains.some((domain) => message.content.startsWith(domain)))
            return;

        if (message.deletable) {
            const automodLogsWebhookClient = new WebhookClient({
                id: automodLogsWebhookID,
                token: automodLogsWebhookToken,
            });
            await message.delete();
            const automodMsg = await message.channel.send(
                `${message.member.toString()}, You cannot send links in this channel`
            );
            setTimeout(() => automodMsg.delete(), 4500);

            const gifLogEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('Link Deleted')
                .setDescription(
                    `${message.member} sent a link in ${message.channel} and it was deleted`
                )
                .addField('Link Sent', `${message.content}`);
            automodLogsWebhookClient.send({ embeds: [gifLogEmbed] });
        }
    }
}

module.exports = { GifAutomodListener };
