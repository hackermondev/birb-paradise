const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed, GuildMember } = require('discord.js');

class UserInfoCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'userinfo',
            aliases: ['user', 'ui', 'whois'],
            description: 'Shows you the details of a user',
            preconditions: ['Staff'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     * @returns
     */
    async messageRun(message, args) {
        const member =
            (await args.pickResult('member')).value ??
            (await args.pickResult('user')).value ??
            message.member;
        const user = member instanceof GuildMember ? member.user : member;

        const userEmbed = new MessageEmbed()
            .setTitle(`${member.user.tag}'s info`)
            .setDescription(
                `This user is ${
                    member instanceof GuildMember ? 'in' : 'not in'
                } this server.\n${member.bot ? 'This is a bot account.' : ''}`
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('YELLOW')
            .addField('Username', user.username, true)
            .addField('Discriminator', user.discriminator, true)
            .addField('ID', user.id, true)
            .addField(
                'Account registered',
                `<t:${Math.round(user.createdAt / 1000)}>`,
                true
            );
        if (member instanceof GuildMember) {
            userEmbed.addField(
                'Joined server',
                `<t:${Math.round(member.joinedAt / 1000)}>`,
                true
            );
            if (member.roles.cache.size > 0)
                userEmbed.addField(
                    'Roles',
                    [
                        ...member.roles.cache
                            .sort((a, b) => b.position - a.position)
                            .values(),
                    ]
                        .slice(0, -1)
                        .join(', ')
                );
        }

        return message.reply({ embeds: [userEmbed] });
    }
}

module.exports = { UserInfoCommand };
