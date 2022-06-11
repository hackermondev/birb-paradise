const { Listener, Events } = require('@sapphire/framework');
const { GuildMember, MessageEmbed } = require('discord.js');
const { memberJoinChannel } = require('../../../config.json');

class GuildMemberRemoveMsg extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.GuildMemberAdd,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        if (!this.container.utility.isBp(member.guild)) return;
        const joinEmbed = new MessageEmbed()
            .setTitle('Welcome')
            .setDescription(`Welcome to the server, ${member}!`)
            .setColor('RANDOM')
            .setThumbnail(
                'https://media.discordapp.net/attachments/891286303574994977/904481443890200616/Untitled1205_20211031142614.png'
            )
            .setFooter({
                iconURL: member.user.avatarURL(),
                text: `${member.user.tag} joined`,
            })
            .setTimestamp();
        return member.guild.channels.cache
            .get(memberJoinChannel)
            .send({ embeds: [joinEmbed] });
    }
}

module.exports = { GuildMemberRemoveMsg };
