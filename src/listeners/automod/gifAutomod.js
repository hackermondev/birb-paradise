const { Listener, Events } = require('@sapphire/framework');
const { Message, WebhookClient, MessageEmbed } = require('discord.js');
const { staffRoles, gifPermRoles } = require('../../../config.json');
const automodLogsWebhookID = process.env.automodLogsWebhookID;
const automodLogsWebhookToken = process.env.automodLogsWebhookToken;
const tenorDomains = ['https://tenor.com', 'https://c.tenor.com'];
class GifAutomodListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'gifAutomod',
            once: false,
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!message.guild) return;
        if (message.author === this.container.client.user) return;
        this.container.client.logger.info(message.member);
        console.log(message.member);
        console.log(message.member.roles);
        console.log(message.member._roles);
        if (staffRoles.some((role) => message.member.roles.cache.has(role)))
            return;
        if (gifPermRoles.some((role) => message.member.roles.cache.has(role)))
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
                `${message.member.toString()}, You do not have permissions to send gifs in this channel`
            );
            setTimeout(() => automodMsg.delete(), 4500);

            const gifLogEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('Gif Deleted')
                .setDescription(
                    `${message.member} sent a gif in ${message.channel} and it was deleted since they lack the perms to send gifs`
                )
                .addField('Gif Sent', `${message.content}`);
            automodLogsWebhookClient.send({ embeds: [gifLogEmbed] });
        }
    }
}

module.exports = { GifAutomodListener };
