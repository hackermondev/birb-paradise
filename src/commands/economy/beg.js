const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed, SimpleEmbed } = require('../../library/embeds');
const { coinEmoji } = require('../../../economy.config.json');
const { Message, MessageEmbed } = require('discord.js');

class EconomyBegCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'beg',
            description: 'beg for coins. smh.',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        let amount = Math.floor(Math.random() * 50) + 10;
        const multiplier = await container.economy.getUserMultiplier(
            message.author.id,
            message.guild.id
        );
        if (multiplier > 1) amount = amount * multiplier;

        const beg = await container.economy.ecoDB.beg(
            message.author.id,
            message.guild.id,
            amount,
            { timeout: 1 * 60000 }
        );
        if (beg.cooldown)
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `Not right now! Come back after ${beg.time.seconds} seconds.`,
                        message.author
                    ),
                ],
            });

        message.reply({
            embeds: [
                SimpleEmbed(
                    `Someone felt bad for you and gave you **${amount} ${coinEmoji}**.`,
                    message.author
                ),
            ],
        });
    }
}

module.exports = { EconomyBegCommand };
