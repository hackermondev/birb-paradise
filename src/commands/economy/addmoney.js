const { Command, Args, container } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { coinEmoji } = require('../../../economy.config.json');
const { SimpleEmbed, ErrorEmbed } = require('../../library/embeds');

class AddMoneyCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'addmoney',
            preconditions: ['Admin'],
            description: "Add money to user's balance.",
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const member = await args.pickResult('member');

        if (!member.success)
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You need to specify who you want to give money to.`,
                        message.author
                    ),
                ],
            });

        const amountArg = await args.pickResult('number');
        if (amountArg.error)
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You need to specify how much you want to give to the user.`,
                        message.author
                    ),
                ],
            });

        const m = member.value;
        await container.economy.ecoDB.addMoney(
            m.id,
            message.guild.id,
            amountArg.value
        );
        message.reply({
            embeds: [
                SimpleEmbed(
                    `You gave **${amountArg.value} ${coinEmoji}** to ${m}`,
                    message.author
                ),
            ],
        });
    }
}

module.exports = { AddMoneyCommand };
