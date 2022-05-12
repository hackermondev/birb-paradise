const { Listener, Events } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const maxNewLines = 10;
const newLineRegex = /\n/g;

class WalltextAutomodListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'walltextAutomod',
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async run(message) {
        if (!(await this.container.utility.automodChecks(message))) return;

        const matches = message.content.match(newLineRegex);
        if (!matches) return;
        if (matches.length < maxNewLines) return;

        if (message.deletable) {
            await message.delete();
            const automodMsg = await message.channel.send(
                `${message.member.toString()}, You may not send walltext in this channel`
            );
            setTimeout(() => automodMsg.delete(), 4500);

            const walltextLogEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('Walltext Deleted')
                .setDescription(
                    `${message.member} sent walltext in ${message.channel} and it was deleted`
                )
                .addField('Walltext Sent', `${message.content}`);
            this.container.utility.sendWebhook(
                process.env.automodLogsWebhookID,
                process.env.automodLogsWebhookToken,
                walltextLogEmbed
            );
        }
    }
}

module.exports = { WalltextAutomodListener };
