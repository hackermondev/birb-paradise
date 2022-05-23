const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed, SimpleEmbed } = require('../../library/embeds');
const { coinEmoji } = require('../../../economy.config.json');
const { Message } = require('discord.js');

class EconomyBetCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'bet',
            aliases: [],
            description: '(Economy) Bet some of your coins.',
            enabled: true,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const amountArg = await args.pickResult('number');
        if (amountArg.error)
            message.reply({
                embeds: [
                    ErrorEmbed(
                        `You need to specify how much you want to bet.`,
                        message.author
                    ),
                ],
            });

        const amount = amountArg.value;
        const userBalance = await container.economy.ecoDB.fetchMoney(
            message.author.id,
            message.guild.id
        );
        if (amount > userBalance)
            return message.reply({
                embeds: [
                    ErrorEmbed(`You don't have enough to bet.`, message.author),
                ],
            });

        // 100 coins bet min
        if (amount < 100)
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You must bet at least **100 ${coinEmoji}**.`,
                        message.author
                    ),
                ],
            });

        // Bet algorthim (will probably be changed in the future)
        // Create an array, then for (amount the user bet/10) times, put a random number in the array between (1)
        // and (amount the user bet). if the array contains the amount of bet, they won

        var amounts = [];
        const interations = Math.floor(amount / 10);

        for (var _x in [...Array(interations).keys()]) {
            amounts.push(Math.floor(Math.random() * amount) + 1);
        }

        if (amounts.includes(amount)) {
            // They won
            await container.economy.ecoDB.addMoney(
                message.author.id,
                message.guild.id,
                amount
            );
            message.reply({
                embeds: [
                    SimpleEmbed(
                        `You won the bet and gained **${amount} ${coinEmoji}**.`,
                        message.author
                    ),
                ],
            });
        } else {
            // They lose
            await container.economy.ecoDB.subtractMoney(
                message.author.id,
                message.guild.id,
                amount
            );
            message.reply({
                embeds: [
                    ErrorEmbed(
                        `You lost the bet and lost **${amount} ${coinEmoji}**.`,
                        message.author
                    ),
                ],
            });
        }
    }
}

module.exports = { EconomyBetCommand };
