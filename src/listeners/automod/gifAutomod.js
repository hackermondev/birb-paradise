const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { gifPermRoles } = require('../../../config.json');
const tenorDomains = ['https://tenor.com', 'https://c.tenor.com'];
class GifAutomodListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'gifAutomod',
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!(await this.container.utility.automodChecks(message))) return;

        if (gifPermRoles.some((role) => message.member.roles.cache.has(role)))
            return;
        if (!tenorDomains.some((domain) => message.content.startsWith(domain)))
            return;

        if (message.deletable) {
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
            this.container.utility.sendWebhook(
                process.env.automodLogsWebhookID,
                process.env.automodLogsWebhookToken,
                gifLogEmbed
            );
        }
    }
}

module.exports = { GifAutomodListener };
