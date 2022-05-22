const { Args } = require('@sapphire/framework');
const {
    SubCommandPluginCommand,
    SubCommandEntry,
} = require('@sapphire/plugin-subcommands');
const { Message, MessageEmbed } = require('discord.js');
const { LeaderboardType } = require('../../library/leaderboard');

class LeaderboardCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'leaderboard',
            description: 'Displays the top 10 users with the most messages.',
            preconditions: ['Admin'],
            subCommands: [
                'hourly',
                'daily',
                'weekly',
                { input: 'alltime', default: true },
            ],
            options: ['limit', 'l'],
            aliases: ['lb', 'leaderboards', 'msglb'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async hourly(message, args) {
        const limit = Number(
            args.getOption('limit') ?? args.getOption('l') ?? 10
        );

        const leaderboard =
            await this.container.leaderboard.constructLeaderboardEmbed(
                LeaderboardType.HOURLY,
                message.guild,
                limit
            );

        return message.reply({ embeds: [leaderboard] });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async daily(message, args) {
        const limit = Number(
            args.getOption('limit') ?? args.getOption('l') ?? 10
        );

        const leaderboard =
            await this.container.leaderboard.constructLeaderboardEmbed(
                LeaderboardType.DAILY,
                message.guild,
                limit
            );

        return message.reply({ embeds: [leaderboard] });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async weekly(message, args) {
        const limit = Number(
            args.getOption('limit') ?? args.getOption('l') ?? 10
        );

        const leaderboard =
            await this.container.leaderboard.constructLeaderboardEmbed(
                LeaderboardType.WEEKLY,
                message.guild,
                limit
            );

        return message.reply({ embeds: [leaderboard] });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async alltime(message, args) {
        const limit = Number(
            args.getOption('limit') ?? args.getOption('l') ?? 10
        );

        const leaderboard =
            await this.container.leaderboard.constructLeaderboardEmbed(
                LeaderboardType.ALL_TIME,
                message.guild,
                limit
            );

        return message.reply({ embeds: [leaderboard] });
    }
}

module.exports = { LeaderboardCommand };
