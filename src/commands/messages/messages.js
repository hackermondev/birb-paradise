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
        if (user.bot)
            return this.container.utility.errorReply(
                message,
                "The message count of bots isn't tracked"
            );

        const allTimeMsgCount =
            (await this.container.leaderboard.getAllTimeMessageCount(
                user.id
            )) ?? '0';
        const weeklyMsgCount =
            (await this.container.leaderboard.getWeeklyMessageCount(user.id)) ??
            '0';
        const dailyMsgCount =
            (await this.container.leaderboard.getDailyMessageCount(user.id)) ??
            '0';
        const hourlyMsgCount =
            (await this.container.leaderboard.getHourlyMessageCount(user.id)) ??
            '0';

        const embed = new MessageEmbed()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .addField('Hourly Message Count', hourlyMsgCount, true)
            .addField('Daily Message Count', dailyMsgCount, true)
            .addField('Weekly Message Count', weeklyMsgCount)
            .addField('All Time Message Count', allTimeMsgCount, true)
            .setColor('BLURPLE')
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }
}

module.exports = { MessagesCommand };
