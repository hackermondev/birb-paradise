const { SubCommandPluginCommand, SubCommandEntry } = require('@sapphire/plugin-subcommands');
const { Message, MessageEmbed } = require('discord.js');

class LeaderboardCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'leaderboard',
            description: 'Displays the top 10 users with the most messages.',
            preconditions: ['Admin'],
            subCommands: ['hourly', 'daily', 'weekly', {input: 'alltime', default: true}],
            aliases: ['lb', 'leaderboards', 'msglb'],
        });
    }

    /**
     *
     * @param { Message } message
     */
    async hourly(message) {
        const allMessages = await this.container.redis.hgetall('messages_hourly');
        const sorted = Object.entries(allMessages).sort((a, b) => b[1] - a[1]);

        const topTenMembers = sorted.map((entry) => entry[0]).slice(0, 10);
        const topTenMemberMessages = sorted
            .map((entry) => entry[1])
            .slice(0, 10);

        const leaderboardEmbed = new MessageEmbed()
            .setTitle('Hourly Message Leaderboard')
            .setColor('RANDOM')
            .setFooter({ text: message.guild.name });

        for (var i = 0; i < topTenMembers.length; ++i) {
            const user = await this.container.client.users
                .fetch(topTenMembers[i])
                .catch(() => null);
            if (!user) continue;
            leaderboardEmbed.addField(
                user.tag,
                `Messages: ${topTenMemberMessages[i]}`,
                true
            );
        }

        if (!leaderboardEmbed.fields.length)
            return message.reply('No members are currently on the hourly leaderboard');

        return message.reply({ embeds: [leaderboardEmbed] });
    }

    /**
     *
     * @param { Message } message
     */
     async daily(message) {
        const allMessages = await this.container.redis.hgetall('messages_daily');
        const sorted = Object.entries(allMessages).sort((a, b) => b[1] - a[1]);

        const topTenMembers = sorted.map((entry) => entry[0]).slice(0, 10);
        const topTenMemberMessages = sorted
            .map((entry) => entry[1])
            .slice(0, 10);

        const leaderboardEmbed = new MessageEmbed()
            .setTitle('Daily Message Leaderboard')
            .setColor('RANDOM')
            .setFooter({ text: message.guild.name });

        for (var i = 0; i < topTenMembers.length; ++i) {
            const user = await this.container.client.users
                .fetch(topTenMembers[i])
                .catch(() => null);
            if (!user) continue;
            leaderboardEmbed.addField(
                user.tag,
                `Messages: ${topTenMemberMessages[i]}`,
                true
            );
        }

        if (!leaderboardEmbed.fields.length)
            return message.reply('No members are currently on the daily leaderboard');

        return message.reply({ embeds: [leaderboardEmbed] });
    }

    /**
     *
     * @param { Message } message
     */
     async weekly(message) {
        const allMessages = await this.container.redis.hgetall('messages_weekly');
        const sorted = Object.entries(allMessages).sort((a, b) => b[1] - a[1]);

        const topTenMembers = sorted.map((entry) => entry[0]).slice(0, 10);
        const topTenMemberMessages = sorted
            .map((entry) => entry[1])
            .slice(0, 10);

        const leaderboardEmbed = new MessageEmbed()
            .setTitle('Weekly Message Leaderboard')
            .setColor('RANDOM')
            .setFooter({ text: message.guild.name });

        for (var i = 0; i < topTenMembers.length; ++i) {
            const user = await this.container.client.users
                .fetch(topTenMembers[i])
                .catch(() => null);
            if (!user) continue;
            leaderboardEmbed.addField(
                user.tag,
                `Messages: ${topTenMemberMessages[i]}`,
                true
            );
        }

        if (!leaderboardEmbed.fields.length)
            return message.reply('No members are currently on the weekly leaderboard');

        return message.reply({ embeds: [leaderboardEmbed] });
    }

    /**
     *
     * @param { Message } message
     */
     async alltime(message) {
        const allMessages = await this.container.redis.hgetall('messages_alltime');
        const sorted = Object.entries(allMessages).sort((a, b) => b[1] - a[1]);

        const topTenMembers = sorted.map((entry) => entry[0]).slice(0, 10);
        const topTenMemberMessages = sorted
            .map((entry) => entry[1])
            .slice(0, 10);

        const leaderboardEmbed = new MessageEmbed()
            .setTitle('All Time Message Leaderboard')
            .setColor('RANDOM')
            .setFooter({ text: message.guild.name });

        for (var i = 0; i < topTenMembers.length; ++i) {
            const user = await this.container.client.users
                .fetch(topTenMembers[i])
                .catch(() => null);
            if (!user) continue;
            leaderboardEmbed.addField(
                user.tag,
                `Messages: ${topTenMemberMessages[i]}`,
                true
            );
        }

        if (!leaderboardEmbed.fields.length)
            return message.reply('No members are currently on the leaderboard');

        return message.reply({ embeds: [leaderboardEmbed] });
    }
}

module.exports = { LeaderboardCommand };
