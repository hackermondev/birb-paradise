const { Command, Args, container } = require('@sapphire/framework');
const { Colors, ErrorEmbed } = require('../../library/embeds');
const { prefix } = require('../../../config.json');
const { items, coinEmoji } = require('../../../economy.config.json');
const {
    PaginatorEvents,
    ActionRowPaginator,
} = require('@psibean/discord.js-pagination');
const { Message, MessageEmbed } = require('discord.js');

class EconomyInventoryCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'inventory',
            aliases: [],
            description: 'View your inventory.',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const userItems = await container.economy.shop.getItems(
            message.author.id,
            message.guild.id
        );
        const itemCategories = [];
        const usersInventory = [];

        const shopItems = items;

        for (var i = 0; i < shopItems.length; i++) {
            const item = shopItems[i];
            const hasItem = userItems.filter((i) => i.id == item.id).length > 0;
            if (hasItem) {
                usersInventory.push(item);
            }

            if (!itemCategories.includes(item.type) && hasItem) {
                itemCategories.push(item.type);
            }
        }

        if (itemCategories.length < 1) {
            return message.reply({
                embeds: [
                    ErrorEmbed(
                        `You do not have any items in your inventory.`,
                        message.author
                    ),
                ],
            });
        }

        let currentItemCategory = itemCategories[0];
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
            ];
        };

        let messageActionRows = buildMessageActionRows();

        const handleItemCategoryChange = async (category) => {
            // Handles when a item category option is selected.

            currentItemCategory = category;

            return {
                pageIdentifier: currentItemCategory,
                itemCategoryType: category,
            };
        };

        // eslint-disable-next-line no-shadow
        const identifiersResolver = async ({ interaction, paginator }) => {
            let newIdentifiers = {};

            if (interaction.componentType === 'SELECT_MENU') {
                const { itemCategoryType: currentItemCategory } =
                    paginator.currentIdentifiers;

                const newItemCategory = interaction.values[0];
                if (newItemCategory !== currentItemCategory) {
                    newIdentifiers = await handleItemCategoryChange(
                        newItemCategory,
                        paginator
                    );
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
                    const newItemCategoryList = usersInventory.filter(
                        (i) => i.type == newPageIdentifier
                    );

                    const newEmbed = new MessageEmbed()
                        .setTitle(
                            `${message.author.tag}'s inventory - ${newPageIdentifier}`
                        )
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.displayAvatarURL(),
                        })
                        .setColor(Colors.Success)
                        .setFooter(
                            `Use ${prefix}sell [itemid] to sell an item.`
                        );

                    const items = await container.economy.shop.getItems(
                        message.author.id,
                        message.guild.id
                    );

                    let description = ``;
                    for (var i = 0; i < newItemCategoryList.length; i++) {
                        const item = newItemCategoryList[i];
                        const itemsOwned = items.filter((i) => i.id == item.id);

                        description += `${item.emoji ? item.emoji : ''} **${
                            item.name
                        }** (${
                            itemsOwned.length
                        }) ─ [${this.container.utility.formatCoins(
                            item.buyingCost || 0
                        )} ${coinEmoji}](https://www.youtube.com/watch?v=DSG53BsUYd0&ab_channel=Cattoh) \n${
                            item.description
                        }\n\n`;
                    }

                    newEmbed.setDescription(description);

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
                paginator.getComponent(0, 0).placeholder = newItemCategoryType;
            }
        };

        const shouldChangePage = ({
            newIdentifiers,
            currentIdentifiers,
            collectorArgs,
        }) => {
            const {
                pageIdentifier: newPageIdentifier,
                itemCategoryType: newItemCategoryType,
            } = newIdentifiers;
            const {
                pageIdentifier: currentPageIdentifier,
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
                newItemCategoryType !== currentItemCategoryType
            );
        };

        const endHandler = async (error) => {
            if (m) await m.edit({ components: [] });
            if (error && typeof error == 'string') {
                message.reply(error);
            }
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
                pageIdentifier: currentItemCategory,
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

module.exports = { EconomyInventoryCommand };
