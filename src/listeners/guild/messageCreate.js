const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { coinEmoji } = require('../../../economy.config.json');

class MessageCreateListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: Events.MessageCreate,
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        await this.updateMessageCount(message);
        await this.checkReactChannels(message);
        await this.checkAFKStatus(message);
    }

    /**
     *
     * @param { Message } message
     */
    async updateMessageCount(message) {
        if (message.author.bot) return;
        if (message.channel.type !== 'GUILD_TEXT') return;
        if (message.system) return;
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
            let amount = Math.floor(Math.random() * 50) + 10;
            await this.container.economy.ecoDB.addMoney(
                message.author.id,
                message.guild.id,
                amount
            );

            const reply = await message.reply(
                `You were rewarded with **${amount} ${coinEmoji}** for being active in chat!`
            );
            setTimeout(() => {
                reply.delete();
            }, 5000);
        }
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async checkReactChannels(message) {
        if (!this.container.utility.isBp(message.guild) || message.author.bot)
            return;
        if (!this.container.utility.isReactChannel(message.channel)) return;
        if (message.author.id === message.guild.ownerId) return;
        return message
            .react('👍')
            .then(message.react('👎'))
            .catch(() => {});
    }

    /**
     * 
     * @param { Message } message 
     */
    async checkAFKStatus(message) {
        if (!this.container.utility.isBp(message.guild)) return;
        if (message.author.bot) return;
        if (message.system) return;
        if (message.channel.type !== 'GUILD_TEXT') return;

        const afk = await this.container.redis.hget('afk', message.author.id);

        if (afk) {
            await this.container.redis.hdel('afk', message.author.id);
            message.reply('Welcome back!')
        }

        if (!message.mentions.members.size) return;
        const mentioned = [...new Set(message.mentions.members.values())];
        for (var i = 0; i < mentioned.length; ++i) {
            const member = mentioned[i];
            if (member.id === message.author.id) continue;
            const afk = await this.container.redis.hget('afk', member.id);
            if (afk) message.reply({content: `${member.user.tag} is currenly AFK: ${afk}`, allowedMentions: {users: [], roles: [], parse: []}});
        }
    }
}

module.exports = { MessageCreateListener };
