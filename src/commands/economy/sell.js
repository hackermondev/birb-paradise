const { Command, Args, container } = require('@sapphire/framework');
const { Message } = require('discord.js');
const Fuse = require('fuse.js');
const { items, coinEmoji } = require('../../../economy.config.json');
const { SimpleEmbed, ErrorEmbed } = require('../../library/embeds');

class EconomySellCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'sell',
            description: 'Quicker way to sell items.',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const itemID = await args.pickResult('string');

        if (!itemID.success)
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You need to specify what item you want to sell.`,
                        message.author
                    ),
                ],
            });

        let amountArg = await args.pickResult('string');
        let amount = 1;

        if (!amountArg.error) {
            amount = parseInt(amountArg.value);
            if (isNaN(amount)) amount = 1;
        }

        if (amount == 0) return message.delete();

        const item = items.filter((i) => i.id == itemID.value)[0];
        if (!item) {
            const fuse = new Fuse(
                items.filter((i) => i.sellable),
                {
                    keys: ['id', 'name', 'description', 'emoji', 'type'],
                    threshold: 0.3,
                }
            );

            const results = fuse.search(itemID.value);
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `That item doesn't exist. ${
                            results.length > 0
                                ? `\nDid you mean: ${results
                                      .map((r) => `\`${r.item.id}\``)
                                      .join(', ')}?`
                                : ''
                        }`,
                        `}`,
                        message.author
                    ),
                ],
            });
        }

        if (item.sellable == false) {
            return message.reply({
                embeds: [
                    ErrorEmbed(`You cannot sell this item.`, message.author),
                ],
            });
        }

        let name = item.name.toLowerCase();
        if (item.emoji) name = item.emoji;

        let userItems = await container.economy.shop.getItems(
            message.author.id,
            message.guild.id
        );
        const itemsOwned = userItems.filter((i) => i.id == item.id);
        if (amountArg.value == 'all') {
            amount = itemsOwned.length;
        }

        if (itemsOwned.length < amount) {
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You don't have enough of this item to sell. You have **${itemsOwned.length} ${name}**.`,
                        message.author
                    ),
                ],
            });
        }

        let moneyEarned = 0;
        for (var i = 0; i < amount; i++) {
            const indexOfItem = userItems.indexOf(itemsOwned[0]);
            moneyEarned += item.sellCost;
            userItems.splice(indexOfItem, 1);
        }

        await container.economy.shop.setItems(
            message.author.id,
            message.guild.id,
            userItems
        );
        await container.economy.ecoDB.addMoney(
            message.author.id,
            message.guild.id,
            moneyEarned
        );

        message.reply({
            embeds: [
                SimpleEmbed(
                    `You sold **${amount} ${name}**. You earned **${moneyEarned} ${coinEmoji}**.`,
                    message.author
                ),
            ],
        });
    }
}

module.exports = { EconomySellCommand };
