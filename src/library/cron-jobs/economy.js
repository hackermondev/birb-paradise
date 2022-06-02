const { container } = require('@sapphire/framework');
const { items } = require('../../../economy.config.json');

container.redis?.del(`runningEconomyCronJob`);

// Check expired shop items
async function run() {
    await container.redis?.set(`runningEconomyCronJob`, '1');
    let usersWithItemsExpiring = await container.redis?.keys(`usersWithItemsExpiring/**`);

    for (let len = 0; len < usersWithItemsExpiring.length; len++) {
        const u = usersWithItemsExpiring[len];

        const user = u.split('/')[1];
        const guildID = u.split('/')[2];

        const guild = await container.client.guilds.fetch(guildID);
        const discordUser = await container.client.users.fetch(user);

        if (!discordUser || !guild) {
            continue;
        }

        const userItems = await container.economy.shop.getItems(
            discordUser.id,
            guildID
        );
        let indexOfItem = -1;

        for (let index = 0; index < userItems.length; index++) {
            const ui = userItems[index];
            if (ui.id == u.split('/')[3]) {
                const expires = items.filter((i) => i.id == ui.id)[0].expires;
                if (
                    new Date().getTime() - new Date(ui.date).getTime() >=
                    expires
                ) {
                    indexOfItem = index;

                    // Remove roles
                    if (items.filter((i) => i.id == ui.id)[0].role) {
                        const member = await guild.members.fetch(user);
                        items
                            .filter((i) => i.id == ui.id)[0]
                            .role.map(async (r) => {
                                member.roles.remove(r);
                            });
                    }
                }
            }
        }

        if (indexOfItem == -1) continue;
        userItems.splice(indexOfItem, 1);

        await container.economy.shop.setItems(
            discordUser.id,
            guildID,
            userItems
        );

        await container.redis.del(u);
        container.logger.info(
            `Removed item "${u.split('/')[3]}" from user ${discordUser.tag}.`
        );
    }

    await container.redis?.del(`runningEconomyCronJob`);
}

module.exports = { run };
