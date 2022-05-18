const { Command } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');

class LeaderboardCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'leaderboard',
            description: 'Displays the top 10 users with the most messages.',
            preconditions: ['Admin'],
            aliases: ['lb', 'leaderboards', 'msglb'],
        });
    }

    /**
     *
     * @param { Message } message
     */
    async messageRun(message) {
        const allMessages = await this.container.redis.hgetall('messages');
        const sorted = Object.entries(allMessages).sort((a, b) => b[1] - a[1]);

        const topTenMembers = sorted.map((entry) => entry[0]).slice(0, 10);
        const topTenMemberMessages = sorted
            .map((entry) => entry[1])
            .slice(0, 10);

        const leaderboardEmbed = new MessageEmbed()
            .setTitle('Message Leaderboard')
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
