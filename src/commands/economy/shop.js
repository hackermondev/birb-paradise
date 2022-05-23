const { Command, Args, container } = require('@sapphire/framework');
const { ErrorEmbed, SimpleEmbed, Colors } = require('../../library/embeds');
const { prefix } = require('../../../config.json');
const { coinEmoji, items } = require('../../../economy.config.json');
const {
    PaginatorEvents,
    ActionRowPaginator,
} = require('@psibean/discord.js-pagination');
const {
    Message,
    MessageEmbed,
    Modal,
    TextInputComponent,
} = require('discord.js');

class EconomyShopCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'shop',
            aliases: [],
            description: '(Economy) View the shop for items you can buy.',
            enabled: true,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message) {
        const itemCategories = [];
        const shopItems = items;
        shopItems.map((item) => {
            if (!itemCategories.includes(item.type)) {
                itemCategories.push(item.type);
            }
        });

        let currentItemCategory = itemCategories[0];
        let currentItemCategoryList = shopItems.filter(
            (i) => i.type == currentItemCategory
        );
        let currentItem = shopItems.filter(
            (i) => i.type == currentItemCategory
        )[0];

        const buildMessageActionRows = () => {
            return [
                {
                    components: [
                        {
                            type: 'SELECT_MENU',
                            placeholder: itemCategories[0],
                            options: itemCategories.map((c) => {
                                return { label: c, value: c };
                            }),

                            customId: 'economy-shop-items-categories',
                        },
                    ],
                },
                {
                    components: [
                        {
                            type: 'SELECT_MENU',
                            placeholder: currentItem.name,
                            options: currentItemCategoryList.map((c) => {
                                return { label: c.name, value: c.name };
                            }),
                            customId: 'economy-shop-items',
                        },
                    ],
                },
                {
                    components: [
                        {
                            type: 'BUTTON',
                            label: `Buy`,
                            customId: `economy-buy-button`,
                            style: 'PRIMARY',
                        },
                        {
                            type: 'BUTTON',
                            label: `Sell`,
                            customId: `economy-sell-button`,
                            style: 'DANGER',
                        },
                    ],
                },
            ];
        };

        let messageActionRows = buildMessageActionRows();

        const handleItemCategoryChange = async (category) => {
            // Handles when a item category option is selected.

            currentItemCategoryList = shopItems.filter(
                (i) => i.type == category
            );
            currentItemCategory = category;
            currentItem = currentItemCategoryList[0];

            return {
                selectOptionsIdentifier: currentItemCategoryList.map((c) => {
                    return { label: c.name, value: c.name };
                }),
                pageIdentifier: currentItemCategoryList[0].name,
                itemCategoryType: category,
            };
        };

        // eslint-disable-next-line no-shadow
        const identifiersResolver = async ({ interaction, paginator }) => {
            let newIdentifiers = {};
            if (interaction.componentType === 'SELECT_MENU') {
                if (
                    interaction.component.customId.includes(
                        'economy-shop-items-categories'
                    )
                ) {
                    const { itemCategoryType: currentItemCategory } =
                        paginator.currentIdentifiers;
                    const newItemCategory = interaction.values[0];
                    if (newItemCategory !== currentItemCategory) {
                        newIdentifiers = await handleItemCategoryChange(
                            newItemCategory,
                            paginator
                        );
                    }
                } else if (
                    interaction.component.customId.includes(
                        'economy-shop-items'
                    )
                ) {
                    currentItem = currentItemCategoryList.filter(
                        (i) => i.name == interaction.values[0]
                    )[0];
                    newIdentifiers = {
                        pageIdentifier: interaction.values[0],
                    };
                }
            } else if (interaction.componentType === 'BUTTON') {
                const { pageIdentifier } = paginator.currentIdentifiers;

                const item = currentItemCategoryList.filter(
                    (i) => i.name == pageIdentifier
                )[0];
                let items = await container.economy.shop.getItems(
                    message.author.id,
                    message.guild.id
                );
                const itemsOwned = items.filter((i) => i.id == item.id);

                if (await container.redis?.exists(`runningEconomyCronJob`)) {
                    await interaction.followUp({
                        content: `The bot is currently running a economy shop check. Please wait a few seconds before doing this action again.`,
                        ephemeral: true,
                    });

                    return {
                        ...paginator.currentIdentifiers,
                        ...newIdentifiers,
                    };
                }

                switch (interaction.component.label) {
                    case 'Buy':
                        if (item.buyable == false) {
                            await interaction.followUp({
                                content: 'You cannot buy this item.',
                                ephemeral: true,
                            });
                        } else if (
                            item.maxLimit &&
                            itemsOwned.length >= item.maxLimit
                        ) {
                            await interaction.followUp({
                                content: `You cannot buy more of this item. (Limit = \`${item.maxLimit}\` )`,
                                ephemeral: true,
                            });
                        } else {
                            const userBalance =
                                await container.economy.ecoDB.fetchMoney(
                                    message.author.id,
                                    message.guild.id
                                );
                            if (item.buyingCost > userBalance) {
                                await interaction.followUp({
                                    content: `You need **${item.buyingCost} ${coinEmoji}** to buy this item.`,
                                    ephemeral: true,
                                });
                            } else {
                                const userMultiplier =
                                    await container.economy.getUserMultiplier(
                                        message.author.id,
                                        message.guild.id
                                    );
                                if (item.multiplier & (userMultiplier != 0)) {
                                    await interaction.followUp({
                                        content: `You cannot buy this item because you have a multiplier active.`,
                                        ephemeral: true,
                                    });

                                    return {
                                        ...paginator.currentIdentifiers,
                                        ...newIdentifiers,
                                    };
                                }

                                items.push({
                                    id: item.id,
                                    type: item.type.toLowerCase(),
                                    date: new Date().toString(),
                                    multiplier: item.multiplier,
                                });

                                await container.economy.shop.setItems(
                                    message.author.id,
                                    message.guild.id,
                                    items
                                );
                                await container.economy.ecoDB.subtractMoney(
                                    message.author.id,
                                    message.guild.id,
                                    item.buyingCost
                                );
                                if (item.role)
                                    item.role.map(
                                        async (r) =>
                                            await message.member.roles.add(r)
                                    );

                                let m = ``;
                                if (item.item) {
                                    m = `You bought **1** of this item. You now have **${
                                        itemsOwned.length + 1
                                    } ${item.name.toLowerCase()}**`;
                                } else if (item.multiplier) {
                                    m = `You bought a ${item.name.toLowerCase()} multiplier. (${
                                        item.multiplier
                                    }x multiplier)`;
                                } else {
                                    m = `You bought this item.`;
                                    if (item.role) {
                                        m += ` You got roles: ${item.role
                                            .map((r) => `<@&${r}>`)
                                            .join(' ')}`;
                                    }
                                }

                                if (item.expires) {
                                    await container.redis?.append(
                                        `usersWithItemsExpiring`,
                                        `${interaction.user.id}|${message.guild.id}|${item.id},`
                                    );
                                }

                                await interaction.followUp({
                                    content: m,
                                    ephemeral: true,
                                });
                            }
                        }

                        break;
                    case 'Sell':
                        if (item.sellable == false) {
                            await interaction.followUp({
                                content: 'You cannot sell this item.',
                                ephemeral: true,
                            });
                        } else if (itemsOwned.length < 1) {
                            await interaction.followUp({
                                content: "You don't have any of this item.",
                                ephemeral: true,
                            });
                        } else {
                            const indexOfItem = items.indexOf(itemsOwned[0]);
                            items.splice(indexOfItem, 1);

                            await container.economy.shop.setItems(
                                message.author.id,
                                message.guild.id,
                                items
                            );
                            await container.economy.ecoDB.addMoney(
                                message.author.id,
                                message.guild.id,
                                item.sellCost
                            );
                            await interaction.followUp({
                                content: `You sold **1 ${item.name.toLowerCase()}**. You now have **${
                                    itemsOwned.length - 1
                                } ${item.name.toLowerCase()}**.${
                                    itemsOwned.length > 2
                                        ? `\n**PROTIP**: Use \`${prefix}sell ${
                                              item.id
                                          } all\` to sell all your ${item.name.toLowerCase()}`
                                        : ``
                                }`,
                                ephemeral: true,
                            });
                        }

                        break;
                }

                return { ...paginator.currentIdentifiers, ...newIdentifiers };
            }

            return { ...paginator.currentIdentifiers, ...newIdentifiers };
        };

        const pageEmbedResolver = async ({
            newIdentifiers,
            currentIdentifiers,
            paginator,
        }) => {
            const { pageIdentifier: newPageIdentifier } = newIdentifiers;
            const { pageIdentifier: currentPageIdentifier } =
                currentIdentifiers;

            if (newPageIdentifier !== currentPageIdentifier) {
                try {
                    const item = shopItems.filter(
                        (i) => i.name == newPageIdentifier
                    )[0];
                    const items = await container.economy.shop.getItems(
                        message.author.id,
                        message.guild.id
                    );
                    const itemsOwned = items.filter((i) => i.id == item.id);

                    const newEmbed = new MessageEmbed()
                        .setTitle(
                            `${item.name} ` +
                                (item.item
                                    ? `(${itemsOwned.length} owned)`
                                    : ``)
                        )
                        .setDescription(
                            `> ${item.description}\n\n**BUY** - ${
                                item.buyable
                                    ? `${item.buyingCost} ${coinEmoji}`
                                    : `You cannot buy this item.`
                            }\n**SELL** - ${
                                item.sellable
                                    ? `${item.sellCost} ${coinEmoji}`
                                    : `Cannot be sold`
                            }`
                        )
                        .setThumbnail(item.thumbnail)
                        .addField(`Rarity`, ` \`Rare\` `, true)
                        .addField(`Type`, `\`${item.type}\``, true)
                        .addField(`ID`, `\`${item.id}\``, true)

                        .setColor(Colors.Success);

                    if (item.role) {
                        newEmbed.addField(
                            `Role`,
                            item.role.map((r) => `<@&${r}>`).join(' ')
                        );
                    }

                    return newEmbed;
                } catch (error) {
                    const sentryErrorID = container.utility.sendException(
                        error,
                        'paginator'
                    );
                    endHandler(
                        `An error occured. Error ID: \`${sentryErrorID}\` `
                    );
                }
            }
            return paginator.currentPage;
        };

        const handleBeforePageChanged = ({
            newIdentifiers,
            currentIdentifiers,
            paginator,
        }) => {
            const { itemCategoryType: currentItemCategoryType } =
                currentIdentifiers;
            const { itemCategoryType: newItemCategoryType } = newIdentifiers;

            if (newItemCategoryType != currentItemCategoryType) {
                paginator.getComponent(1, 0).options =
                    currentItemCategoryList.map((c) => {
                        return { label: c.name, value: c.name };
                    });

                paginator.getComponent(0, 0).placeholder = newItemCategoryType;
            }

            paginator.getComponent(1, 0).placeholder = currentItem.name;
        };

        const shouldChangePage = ({
            newIdentifiers,
            currentIdentifiers,
            collectorArgs,
        }) => {
            const {
                pageIdentifier: newPageIdentifier,
                selectOptionsIdentifier: newSelectOptionsIdentifier,
                itemCategoryType: newItemCategoryType,
            } = newIdentifiers;
            const {
                pageIdentifier: currentPageIdentifier,
                selectOptionsIdentifier: currentSelectOptionsIdentifier,
                itemCategoryType: currentItemCategoryType,
            } = currentIdentifiers;

            if (collectorArgs.interaction.user.id != message.author.id) {
                collectorArgs.interaction.followUp({
                    content: `You cannot edit the data for this shop.`,
                    ephemeral: true,
                });

                return false;
            }

            return (
                newPageIdentifier !== currentPageIdentifier ||
                newSelectOptionsIdentifier !== currentSelectOptionsIdentifier ||
                newItemCategoryType !== currentItemCategoryType
            );
        };

        const endHandler = async (error) => {
            await m.suppressEmbeds(true);
            await m.edit({
                content:
                    error && typeof error == 'string'
                        ? error
                        : `Shop command expired or closed.`,
                components: [],
                embeds: [],
            });
        };

        // Pagination only allows interactions so create fake interaction
        let m = null;
        const interaction = {
            channel: message.channel,
            client: message.client,
            user: message.author,
            editReply: async (data) => {
                let r = null;
                if (m == null) {
                    r = await message.channel.send(data);
                    m = r;
                } else {
                    r = await m.edit(data);
                }

                return r;
            },
        };

        const actionRowPaginator = new ActionRowPaginator(interaction, {
            useCache: false,
            messageActionRows,
            initialIdentifiers: {
                itemCategoryType: currentItemCategory,
                pageIdentifier: currentItem.name,
                selectOptionsIdentifier: [],
            },

            identifiersResolver,
            pageEmbedResolver,
            shouldChangePage,
        })
            .on(PaginatorEvents.COLLECT_ERROR, (err) => {
                const sentryErrorID = container.utility.sendException(
                    err,
                    'paginator'
                );
                endHandler(`An error occured. Error ID: \`${sentryErrorID}\` `);
            })
            .on(PaginatorEvents.BEFORE_PAGE_CHANGED, handleBeforePageChanged)
            .on(PaginatorEvents.PAGINATION_END, endHandler);

        await actionRowPaginator.send();
    }
}

module.exports = { EconomyShopCommand };
