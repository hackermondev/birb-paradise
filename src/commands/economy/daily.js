const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed, SimpleEmbed } = require('../../library/embeds');
const { coinEmoji } = require('../../../economy.config.json');
const { Message } = require('discord.js');

class EconomyDailyCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'daily',
            aliases: [],
            description: '(Economy) Recieve your daily amount of coins.',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message) {
        let amount = Math.floor(Math.random() * 500) + 100;
        const multiplier = await container.economy.getUserMultiplier(
            message.author.id,
            message.guild.id
        );
        if (multiplier > 1) amount = amount * multiplier;

        const addMoney = await container.economy.ecoDB.daily(
            message.author.id,
            message.guild.id,
            amount
        );
        if (addMoney.cooldown)
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You have already claimed your daily coins. Come back after **${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds}** seconds to claim it again.`,
                        message.author
                    ),
                ],
            });

        message.reply({
            embeds: [
                SimpleEmbed(
                    `You have claimed **${addMoney.amount} ${coinEmoji}** as your daily credit.`,
                    message.author
                ),
            ],
        });
    }
}

module.exports = { EconomyDailyCommand };
