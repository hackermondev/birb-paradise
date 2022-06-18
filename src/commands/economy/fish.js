const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed, SimpleEmbed } = require('../../library/embeds');
const { items } = require('../../../economy.config.json');
const { Util } = require('quick.eco');
const { Time } = require('@sapphire/time-utilities');
const { Message } = require('discord.js');

class EconomyFishCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'fish',
            description: 'Fish for fish. Requires you to have a fishing pole.',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const hasFishingPole = await this.container.economy.shop.hasItems(
            message.author.id,
            message.guild.id,
            [
                {
                    id: 'fishingpole',
                },
            ]
        );

        if (!hasFishingPole) {
            return message.channel.send({
                embeds: [
                    ErrorEmbed(
                        `You need to have a **fishing pole** to use this command. Get it from the shop.`,
                        message.author
                    ),
                ],
            });
        }

        const key = Util.makeKey(
            message.author.id,
            message.guild.id,
            'fishing_cooldown'
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
                        `You need to wait in line! Come back after **${timeRemaining.seconds} seconds**`,
                        message.author
                    ),
                ],
            });
        }

        const fishChances = {
            fish: 85,
            sharkfish: 5,
            rarefish: 10,
        };

        const array = [];
        await Promise.all(
            Object.keys(fishChances).map((type) => {
                for (var i = 0; i < fishChances[type]; i++) {
                    array.push(type);
                }
            })
        );

        const type = array[Math.floor(Math.random() * array.length - 1) + 0];
        const item = items.filter((i) => i.id == type)[0];
        const e = SimpleEmbed(
            `You got a **${item.name.toLowerCase()}**. You can sell them through the shop command.`,
            message.author
        );

        const userItems = await container.economy.shop.getItems(
            message.author.id,
            message.guild.id
        );
        userItems.push({
            id: type,
            date: new Date().toString(),
        });

        const i = await container.economy.shop.setItems(
            message.author.id,
            message.guild.id,
            userItems
        );

        if (i.length != userItems.length) {
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `Something went wrong. Please try again in a few minutes.`,
                        message.author
                    ),
                ],
            });
        }

        await container.economy.ecoDB._set(key, Date.now());

        message.reply({ embeds: [e] });
    }
}

module.exports = { EconomyFishCommand };
