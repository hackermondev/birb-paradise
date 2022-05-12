const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');

class MassMentionAutomod extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'massMentionAutomod',
            event: Events.MessageCreate,
            enabled: false, // disabling this automod until we have a db to track punishments
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (!(await this.container.utility.automodChecks(message))) return;

        if (new Set(message.mentions.users).size > 10 && message.deletable) {
            await message.delete();
            const automodMsg = await message.channel.send(
                `${message.member.toString()}, You may not mention more than 10 users in a single message.`
            );
            setTimeout(() => automodMsg.delete(), 4500);

            await message.member.ban({
                days: 0,
                reason: '[AUTOMOD] Mass Mention',
            });

            const gifLogEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('Link Deleted')
                .setDescription(
                    `${message.member} sent a link in ${message.channel} and it was deleted`
                )
                .addField('Link Sent', `${message.content}`);
            this.container.utility.sendWebhook(
                process.env.automodLogsWebhookID,
                process.env.automodLogsWebhookToken,
                gifLogEmbed
            );
        }
    }
}

module.exports = { MassMentionAutomod };
