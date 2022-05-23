const { Listener, Events } = require('@sapphire/framework');
const { coinEmoji } = require('../../../economy.config.json');
const { Message, MessageEmbed } = require('discord.js');

class UpdateMessageCountListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'updateMessageCount',
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (message.author.bot) return;
        if (message.channel.type !== 'GUILD_TEXT') return;
        if (!this.container.utility.isBp(message.guild)) return;
        if (!message.member) return;

        if (
            message.content.length &&
            process.env['DISABLE_PERSPECTIVE'] == undefined
        ) {
            const spamAnalyzed = await this.container.perspective?.analyzeSpam(
                message.content
            );

            if (spamAnalyzed && spamAnalyzed > 0.5) return; // if message is spam do not add it to the message count
        }

        await this.container.leaderboard?.addAllTimeMessageCount(
            message.member.id,
            1
        );
        await this.container.leaderboard?.addWeeklyMessageCount(
            message.member.id,
            1
        );
        await this.container.leaderboard?.addDailyMessageCount(
            message.member.id,
            1
        );
        await this.container.leaderboard?.addHourlyMessageCount(
            message.member.id,
            1
        );

        // Economy
        const hourlyMessageCount =
            await this.container.leaderboard?.getHourlyMessageCount(
                message.member.id
            );
        // rewards for every 20 messages per hour
        if ((hourlyMessageCount / 20) % 1 == 0) {
            let amount = Math.floor(Math.random() * 5000) + 1000;
            await this.container.economy.ecoDB.addMoney(
                message.author.id,
                message.guild.id,
                amount
            );
            const embed = new MessageEmbed()
                .setTitle(`Message Rewards`)
                .setDescription(
                    `You were rewarded with **${amount} ${coinEmoji}** for being active in chat!`
                )
                .setTimestamp()
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL(),
                });

            message.reply(embed);
        }
    }
}

module.exports = { UpdateMessageCountListener };
