const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed, SimpleEmbed } = require('../../library/embeds');
const { Util } = require('quick.eco');
const { Time } = require('@sapphire/time-utilities');
const { Message } = require('discord.js');

class EconomyBegCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'hunt',
            description:
                'Hunt for animals. Requires you to have a rifle.',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const hasRifle = await this.container.economy.shop.hasItems(
            message.author.id,
            message.guild.id,
            [
                {
                    id: 'rifle',
                },
            ]
        );

        if (!hasRifle) {
            return message.channel.send({
                embeds: [
                    ErrorEmbed(
                        `You need to have a **rifle** to use this command. Get it from the shop.`,
                        message.author
                    ),
                ],
            });
        }

        const key = Util.makeKey(
            message.author.id,
            message.guild.id,
            'hunting_cooldown'
        );
        const time = Time.Minute;

        const cooldownRaw = await container.economy.ecoDB._get(key);
        const cooldown = Util.onCooldown(
            time,
            cooldownRaw ? cooldownRaw.data : 0
        );
        if (cooldown) {
            const timeRemaining = Util.getCooldown(
                time,
                cooldownRaw ? cooldownRaw.data : 0
            );
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You need to reload your weapon first! Come back after \`${timeRemaining.seconds} seconds\``,
                        message.author
                    ),
                ],
            });
        }

        const deerFound = Math.floor(Math.random() * 3) + 1;
        const e = SimpleEmbed(
            `You hunted **${deerFound} :deer:**. You can sell them through the shop command.`,
            message.author
        );

        const items = await container.economy.shop.getItems(
            message.author.id,
            message.guild.id
        );
        for (var i = 0; i < deerFound; i++) {
            items.push({
                id: 'deer',
                date: new Date().toString(),
            });
        }

        await container.economy.shop.setItems(
            message.author.id,
            message.guild.id,
            items
        );
        await container.economy.ecoDB._set(key, Date.now());

        message.reply({ embeds: [e] });
    }
}

module.exports = { EconomyBegCommand };
