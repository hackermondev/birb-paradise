const { Command, Args, container } = require('@sapphire/framework');
const { coinEmoji } = require('../../../economy.config.json');
const { MessageEmbed, Message } = require('discord.js');
const { Util } = require('quick.eco');

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
        await container.economy.ecoDB.__checkManager();
        const limit = 5;

        const data = (await container.economy.ecoDB.all())
            .filter((x) => x.ID.startsWith(container.economy.ecoDB.prefix))
            .filter((x) => x.ID.includes(message.guild.id))
            .splice(0, limit);

        const leaderboard = [];
        data.sort((a, b) => b.data - a.data).forEach((item, index) => {
            const parsedKey = Util.parseKey(item.ID);

            const data = {
                position: index + 1,
                user: `${parsedKey.userID}`,
                guild: `${parsedKey.guildID || ''}`,
                money: isNaN(item.data) ? 0 : item.data,
            };

            leaderboard.push(data);
        });

        let text = await Promise.all(leaderboard.map(async (user, index) => {
            let emoji = '';
            if (index == 0) emoji = '🥇';
            if (index == 1) emoji = '🥈';
            if (index == 2) emoji = '🥉';
            if (emoji == '') emoji = `🔹`;

            const u = await this.container.client.users.fetch(user.user, { cache: false });
            return `${emoji} **${user.money} ${coinEmoji}** - ${u.tag}`;
        }))

        text = text.join('\n');
        const embed = new MessageEmbed()
            .setTitle(`Richest Users in ${message.guild.name}`)
            .setDescription(
                text == '' ? `No one on the leaderboard :flushed:` : text
            );

        message.channel.send({ embeds: [embed] });
    }
}

module.exports = { EconomyLeaderboardCommand };
