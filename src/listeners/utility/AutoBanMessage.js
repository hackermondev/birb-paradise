const { Listener, Events } = require('@sapphire/framework');
const { GuildBan, Message, MessageEmbed } = require('discord.js');
const { evidenceChannel } = require('../../../config.json');

class AutoBanMessageListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'guildBanAdd',
            event: Events.GuildBanAdd,
        });
    }

    /**
     *
     * @param { GuildBan } ban
     */
    async run(ban) {
        if (!this.container.utility.isBp(ban.guild)) return;
        await ban.fetch();
        const banEmbed = new MessageEmbed()
            .setTitle('User Banned')
            .setColor('RED')
            .addField('User', `<@${ban.user.id}> (${ban.user.tag})`)
            .addField('Reason', `${ban.reason}`)
            .addField('Moderator', `Parallel#7735`)
            .setFooter({ text: `User ID: ${ban.user.id} - ${ban.guild.name}` });

        ban.guild.channels.cache
            .get(evidenceChannel)
            .send({ embeds: [banEmbed] });
    }
}

module.exports = { AutoBanMessageListener };
