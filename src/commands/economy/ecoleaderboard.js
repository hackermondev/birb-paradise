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
            15
        );
      
        let text = await Promise.all(
            leaderboard.map(async (user, index) => {
                let emoji = '';
                if (index == 0) emoji = '🥇';
                if (index == 1) emoji = '🥈';
                if (index == 2) emoji = '🥉';
                if (emoji == '') emoji = `🔹`;

                const u = await message.client.users.fetch(user.user, {
                    cache: false,
                });
                return `${emoji} **${user.money} ${coinEmoji}** - ${u.tag}`;
            })
        );

        text = text.join('\n');
        const embed = new MessageEmbed()
            .setTitle('Top 15 Richest Users')
            .setDescription(
                text == '' ? `No one on the leaderboard :flush:` : text
            );

        message.channel.send({ embeds: [embed] });
    }
}

module.exports = { EconomyLeaderboardCommand };
