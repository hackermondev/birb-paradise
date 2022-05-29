const { Command, Args, container } = require('@sapphire/framework');
const { MessageEmbed, Message } = require('discord.js');
const { Util } = require('quick.eco');

class EconomyLeaderboardCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ecoleaderboard',
            aliases: ['moneyleaders', 'moneyleaderboard'],
            description:
                'View the top 15 richest users in the server.',
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
            .sort((a, b) => b.data - a.data)
            .slice(0, limit);

        console.log(data);

        const leaderboard = data.map((item, index) => {
          const parsedKey = Util.parseKey(item.ID)

            const data = {
                position: index + 1,
                user: `${parsedKey.userID}`,
                guild: `${parsedKey.guildID || ''}`,
                money: isNaN(item.data) ? 0 : item.data,
            };

            return data;
        })

        const emojiLibrary = {
            0: '🥇',
            1: '🥈',
            2: '🥉',
            3: '🔹',
            4: '🔹',
        }

        const text = (await Promise.all(leaderboard.map(async (user, index) => {
            const emoji = emojiLibrary[index];

            const u = await this.container.client.users.fetch(user.user);
            return `${emoji} ${u.tag} - **${user.money.toLocaleString()}**`;
        }))).join('\n');

        const embed = new MessageEmbed()
            .setTitle(`Richest Users in ${message.guild.name}`)
            .setDescription(text);

        message.channel.send({ embeds: [embed] });
    }
}

module.exports = { EconomyLeaderboardCommand };
