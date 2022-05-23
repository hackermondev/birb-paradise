const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed, SimpleEmbed } = require('../../library/embeds');
const { coinEmoji } = require('../../../economy.config.json');
const { Util } = require('quick.eco');
const { Message } = require('discord.js');

class HourlyCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'hourly',
            aliases: [],
            description: '(Economy) Recieve your hourly amount of coins.',
            enabled: true,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message) {
        let amount = Math.floor(Math.random() * 100) + 50;
        const multiplier = await container.economy.getUserMultiplier(
            message.author.id,
            message.guild.id
        );
        if (multiplier > 1) amount = amount * multiplier;

        const key = Util.makeKey(message.author.id, message.guild.id, 'hourly');
        const cooldownRaw = await container.economy.ecoDB._get(key);
        const cooldown = Util.onCooldown(
            3.6e6,
            cooldownRaw ? cooldownRaw.data : 0
        );
        if (cooldown) {
            const time = Util.getCooldown(
                3.6e6,
                cooldownRaw ? cooldownRaw.data : 0
            );
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You have already claimed your hourly coins. Come back after **${time.minutes} minutes & ${time.seconds}** seconds to claim it again.`,
                        message.author
                    ),
                ],
            });
        }

        await container.economy.ecoDB.addMoney(
            message.author.id,
            message.guild.id,
            amount
        );
        await container.economy.ecoDB._set(key, Date.now());

        message.reply({
            embeds: [
                SimpleEmbed(
                    `You have claimed **${amount} ${coinEmoji}** as your hourly credit.`,
                    message.author
                ),
            ],
        });
    }
}

module.exports = { HourlyCommand };
