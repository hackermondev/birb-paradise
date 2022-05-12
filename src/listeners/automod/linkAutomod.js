const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const tenorDomains = ['https://tenor.com', 'https://c.tenor.com'];
const linkRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

class LinkAutomodListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'linkAutomod',
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!(await this.container.utility.automodChecks(message))) return;

        if (!linkRegex.test(message.content)) return;
        if (tenorDomains.some((domain) => message.content.includes(domain)))
            // return to be handled by the gif automod
            return;

        if (message.deletable) {
            await message.delete();
            const automodMsg = await message.channel.send(
                `${message.member.toString()}, You cannot send links in this channel`
            );
            setTimeout(() => automodMsg.delete(), 4500);

            const linkLogEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('Link Deleted')
                .setDescription(
                    `${message.member} sent a link in ${message.channel} and it was deleted`
                )
                .addField('Link Sent', `${message.content}`);
            this.container.utility.sendWebhook(
                process.env.automodLogsWebhookID,
                process.env.automodLogsWebhookToken,
                linkLogEmbed
            );
        }
    }
}

module.exports = { LinkAutomodListener };
