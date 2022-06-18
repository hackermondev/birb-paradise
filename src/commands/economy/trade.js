const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed } = require('../../library/embeds');
const { items, coinEmoji } = require('../../../economy.config.json');
const {
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
} = require('discord.js');
const shopItems = items;

class EconomyTradeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'trade',
            description: 'Trade items with other players. ',
            aliases: ['give', 'gift', 'trade-items'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        // >trade @user item1 item2 item3
        const mentioned = await args.pickResult('member');
        if (
            mentioned.error ||
            mentioned.value.user.bot ||
            mentioned.value.user.id == message.author.id
        ) {
            return message.channel.send({
                embeds: [
                    ErrorEmbed(
                        `You need to mention a **valid user** to trade with.`,
                        message.author
                    ),
                ],
            });
        }

        const content = message.content.split(' ');
        content.shift();
        content.shift();

        const userItems =
            content.join(' ').split('for')[0]?.trim().split(' ') || [];
        const otherUserItems =
            content.join(' ').split('for')[1]?.trim().split(' ') || [];

        const tradeMapFunction = async (user, item) => {
            if (item.toLowerCase() == 'nothing') {
                return {
                    error: true,
                };
            }

            const itemFound = shopItems.filter((i) => i.id === item)[0];
            if (!itemFound) {
                const number = container.economy.convertTextToString(item);
                if (number == 0) {
                    return {
                        error: true,
                        message: `Item ${item} not found.`,
                    };
                }

                const userBalance = await container.economy.ecoDB.fetchMoney(
                    user.id,
                    message.guild.id
                );
                if (userBalance < number) {
                    return {
                        error: true,
                        message: `**${user.tag}** doesn't have **${number}** ${coinEmoji} to trade.`,
                    };
                }

                return {
                    id: null,
                    name: null,
                    coins: number,
                };
            }

            const has = await container.economy.shop.hasItems(
                user.id,
                message.guild.id,
                [{ id: itemFound.id }]
            );
            if (!has) {
                return {
                    error: true,
                    message: `**${
                        this.tag
                    }** doesn't have ${itemFound.name.toLowerCase()}.`,
                };
            }

            if (!itemFound.tradeable) {
                return {
                    error: true,
                    message: `You cannot trade **${itemFound.name.toLowerCase()}**.`,
                };
            }

            return {
                id: itemFound.id,
                name: itemFound.name,
            };
        };

        const errors = [];
        let userItemsToTrade = await Promise.all(
            userItems.map(tradeMapFunction.bind(null, message.author))
        );
        userItemsToTrade = userItemsToTrade.filter((i) => {
            if (i.error) {
                if (i.message) errors.push(i.message);
                return false;
            }

            return true;
        });

        let otherUserItemsToTrade = await Promise.all(
            otherUserItems.map(
                tradeMapFunction.bind(null, mentioned.value.user)
            )
        );
        otherUserItemsToTrade = otherUserItemsToTrade.filter((i) => {
            if (i.error) {
                if (i.message) errors.push(i.message);
                return false;
            }

            return true;
        });

        if (userItemsToTrade.length == 0 && otherUserItemsToTrade.length == 0) {
            const e = ErrorEmbed(`Could not start trade.`, message.author);
            if (errors.length > 0) {
                e.addField(`Errors`, errors.join('\n'));
            }

            return message.reply({ embeds: [e] });
        }

        const embed = new MessageEmbed()
            .setTitle(
                `${message.author.tag} wants to trade with ${mentioned.value.user.tag}`
            )
            .addField(
                `${message.author.tag} gives:`,
                `${
                    userItemsToTrade.length > 0
                        ? userItemsToTrade
                              .map((i) =>
                                  i.coins
                                      ? `${i.coins} ${coinEmoji}`
                                      : `1 ${i.name.toLowerCase()}`
                              )
                              .join(', ')
                        : `Nothing`
                }`
            )
            .addField(
                `${mentioned.value.user.tag} gives:`,
                `${
                    otherUserItemsToTrade.length > 0
                        ? otherUserItemsToTrade
                              .map((i) =>
                                  i.coins
                                      ? `${i.coins} ${coinEmoji}`
                                      : `1 ${i.name.toLowerCase()}`
                              )
                              .join(', ')
                        : `Nothing`
                }`
            )
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setFooter(`You have 10 minutes to accept or decline the trade.`)
            .setColor(message.member.displayHexColor || '#7289DA');

        if (errors.length > 0) {
            embed.addField(`Errors`, errors.join('\n'));
        }

        const button = new MessageButton()
            .setCustomId('economy-confirm-trade')
            .setLabel('Confirm Trade')
            .setStyle('PRIMARY');

        const cancelButton = new MessageButton()
            .setCustomId(`economy-cancel-trade`)
            .setLabel('Cancel Trade')
            .setStyle('SECONDARY');

        const row = new MessageActionRow().addComponents(button, cancelButton);
        const collector = message.channel.createMessageComponentCollector(
            (m) => m.user.id === mentioned.value.id,
            { time: 60000 }
        );

        const mess = await message.reply({
            content: `${mentioned.value.user}, ${message.author} wants to trade with you.`,
            embeds: [embed],
            components: [row],
        });

        collector.on('collect', async (m) => {
            if (m.user.id != mentioned.value.id)
                return m.reply({ content: `Smh.`, ephemeral: true });
            if (m.customId == 'economy-confirm-trade') {
                collector.stop();
                m.reply({
                    content: `${mentioned.value.user} accepted the trade.`,
                    ephemeral: true,
                });

                embed.setColor('GREEN');
                embed.setTitle(`Trade Accepted`);
                embed.setDescription(
                    `${message.author.tag} accepted the trade.`
                );

                const endUser = mentioned.value.user;
                for (var i = 0; i < userItemsToTrade.length; i++) {
                    if (userItemsToTrade[i].coins) {
                        container.economy.ecoDB.subtractMoney(
                            message.author.id,
                            message.guild.id,
                            userItemsToTrade[i].coins
                        );
                        container.economy.ecoDB.addMoney(
                            endUser.id,
                            message.guild.id,
                            userItemsToTrade[i].coins
                        );
                    } else {
                        const userItems = await container.economy.shop.getItems(
                            endUser.id,
                            message.guild.id
                        );

                        const item = shopItems.filter(
                            (a) => a.id === userItemsToTrade[i].id
                        )[0];
                        userItems.push({
                            id: item.id,
                            type: item.type.toLowerCase(),
                            date: new Date().toString(),
                            multiplier: item.multiplier,
                        });

                        await container.economy.shop.removeItems(
                            message.author.id,
                            message.guild.id,
                            userItemsToTrade[i].id,
                            1
                        );
                        await container.economy.shop.setItems(
                            endUser.id,
                            message.guild.id,
                            userItems
                        );
                    }
                }

                for (var i = 0; i < otherUserItemsToTrade.length; i++) {
                    if (otherUserItemsToTrade[i].coins) {
                        await container.economy.ecoDB.subtractMoney(
                            endUser.id,
                            message.guild.id,
                            otherUserItemsToTrade[i].coins
                        );
                        await container.economy.ecoDB.addMoney(
                            message.author.id,
                            message.guild.id,
                            otherUserItemsToTrade[i].coins
                        );
                    } else {
                        const userItems = await container.economy.shop.getItems(
                            message.author.id,
                            message.guild.id
                        );
                        const item = shopItems.filter(
                            (a) => a.id === otherUserItemsToTrade[i].id
                        )[0];
                        userItems.push({
                            id: item.id,
                            type: item.type.toLowerCase(),
                            date: new Date().toString(),
                            multiplier: item.multiplier,
                        });

                        await container.economy.shop.removeItems(
                            endUser.id,
                            message.guild.id,
                            userItemsToTrade[i].id,
                            1
                        );
                        await container.economy.shop.setItems(
                            message.author.id,
                            message.guild.id,
                            userItems
                        );
                    }
                }

                await mess.suppressEmbeds(true);
                await mess.edit(`${mentioned.value.user} accepted the trade.`, {
                    components: [],
                    embeds: [],
                });
                await m.message.reply({ embeds: [embed] });
                m.reply({
                    content: `${mentioned.value.user} accepted the trade.`,
                    ephemeral: true,
                });
            } else if (m.customId == 'economy-cancel-trade') {
                collector.stop();

                embed.setColor('#FF0000');
                embed.setTitle(`Trade Cancelled`);
                embed.setDescription(
                    `${message.author.tag} cancelled the trade.`
                );

                await mess.suppressEmbeds(true);
                await mess.edit(`${mentioned.value.user} canceled the trade.`, {
                    components: [],
                    embeds: [],
                });
                await m.message.reply({ embeds: [embed] });
                m.reply({
                    content: `${mentioned.value.user} cancelled the trade.`,
                    ephemeral: true,
                });
            }
        });

        collector.on('end', async (_, reason) => {
            if (reason == 'time') {
                embed.setColor(`#FF0000`);
                await mess.suppressEmbeds(true);
                mess.edit(
                    `Trade expired. ${mentioned.value.user} did not respond in time.`,
                    { components: [], embeds: [embed] }
                );
            }
        });
    }
}

module.exports = { EconomyTradeCommand };
