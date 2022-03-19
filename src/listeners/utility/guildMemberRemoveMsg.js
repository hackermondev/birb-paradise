const { Listener, Events } = require('@sapphire/framework');
const { GuildMember, MessageEmbed, WebhookClient } = require('discord.js');
const { memberLeaveChannel } = require('../../../config.json');

class GuildMemberRemoveMsg extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: false,
            event: Events.GuildMemberRemove,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        return member.guild.channels.cache
            .get(memberLeaveChannel)
            .send(
                `**${member.user.tag}** just left the server, sadge <:verysadbirb:925771843040841768>`
            );
    }
}

module.exports = { GuildMemberRemoveMsg };
