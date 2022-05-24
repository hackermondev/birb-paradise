const { Command, Args, container } = require('@sapphire/framework');
const { coinEmoji } = require('../../../economy.config.json');
const { MessageEmbed, Message } = require('discord.js');

class EconomyLeaderboardCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ecoleaderboard',
            aliases: ['moneyleaders', 'moneyleaderboard'],
            description:
                '(Economy) View the top 15 richest users in the server.',

        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message) {
        const leaderboard = await container.economy.ecoDB.leaderboard(
            message.guild.id,
            20
        );

        let text = leaderboard.map((user, index) => {
            let emoji = '';
            if (index == 0) emoji = '🥇';
            if (index == 1) emoji = '🥈';
            if (index == 2) emoji = '🥉';
            if (emoji == '') emoji = `🔹`;

            const u = await message.client.users.fetch(user.user);
            return `${emoji} **${user.money} ${coinEmoji}** - <@${user.user}>`;
        });

        text = text.join('\n');
        const embed = new MessageEmbed()
            .setTitle(`Richest Users in ${message.guild.name}`)
            .setDescription(
                text == '' ? `No one on the leaderboard :flush:` : text
            );

        message.channel.send({ embeds: [embed] });
    }
}

module.exports = { EconomyLeaderboardCommand };
