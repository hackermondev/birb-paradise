const { Listener, Events } = require('@sapphire/framework');
const { Message, WebhookClient, MessageEmbed } = require('discord.js');
const {
    staffRoles,
    gifPermRoles,
    automodLogsWebhookID,
    automodLogsWebhookToken,
} = require('../../config.json');
const tenorDomains = ['https://tenor.com', 'https://c.tenor.com'];
class AutomodGifPermsListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'automodGifPerms',
            once: false,
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        this.container.logger.debug(message.member);
        await message.member.fetch();
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
                    `${message.member.toString()} sent a gif in ${
                        message.channelId
                    } and it was deleted since they lack the perms to send gifs`
                );
            automodLogsWebhookClient.send({ embeds: [gifLogEmbed] });
        }
    }
}

module.exports = { AutomodGifPermsListener };
