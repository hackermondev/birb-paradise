const { Listener, Events } = require('@sapphire/framework');
const { GuildMember, MessageEmbed, WebhookClient } = require('discord.js');
const { memberLeaveChannel } = require('../../../config.json');

class GuildMemberRemoveMsg extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.GuildMemberRemove,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        if (!this.container.utility.isBp(member.guild)) return;

        // Ticketing system
        if (member.user.bot) return;
        const openTickets = await this.container.redis.keys(
            `bp/ticket/${member.user.id}/*`
        );
        if (openTickets.length > 0) {
            for (var i = 0; i < openTickets.length; i++) {
                const ticketChannelID = openTickets[i].split('/')[3];
                const channel = await this.container.client.channels.fetch(
                    ticketChannelID,
                    { cache: false }
                );
                await channel.send({
                    content: `Deleting ticket in 5 seconds because the owner left server.`,
                });

                setTimeout(() => channel.delete(), 5 * 1000);
            }

            await this.container.redis.del(openTickets);
        }

        return member.guild.channels.cache
            .get(memberLeaveChannel)
            .send(
                `**${member.user.tag}** just left the server, sadge <:verysadbirb:925771843040841768>`
            );
    }
}

module.exports = { GuildMemberRemoveMsg };
