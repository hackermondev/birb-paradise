const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');

class MessagesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'messages',
            description: 'Gets the message count for a member.',
            preconditions: ['Admin'],
            aliases: ['messagecount', 'messagecounts', 'msgcount', 'msgs'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const argUser = await args.pickResult('user');

        const user = this.container.utility.isStaffMember(message.member)
            ? argUser.value ?? message.member.user
            : message.member.user;

        const msgCount =
            (await this.container.utility.getMessageCount(user.id)) ?? '0';

        const embed = new MessageEmbed()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .addField('Message Count', msgCount)
            .setColor('BLURPLE')
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }
}

module.exports = { MessagesCommand };