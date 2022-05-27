const { container } = require('@sapphire/framework');
const { items } = require('../../../economy.config.json');

container.redis?.del(`runningEconomyCronJob`);

// Check expired shop items
async function run() {
    container.logger.info(`Running economy cron job.`);
    /*
        usersWithItemsExpiring = "
            userid|guildid|itemid,
            963141789571756062|895515788126072842|giveawayclaimtimebypass,
        "
    */

    await container.redis?.set(`runningEconomyCronJob`, '1');
    let usersWithItemsExpiringRaw = await container.redis?.get(
        `usersWithItemsExpiring`
    );
    if (usersWithItemsExpiringRaw == null) usersWithItemsExpiringRaw = '';
    let usersWithItemsExpiring = usersWithItemsExpiringRaw
        .split(',')
        .filter((a) => a != '');

    for (let len = 0; len < usersWithItemsExpiring.length; len++) {
        const u = usersWithItemsExpiring[len];
        const user = u.split('|')[0];
        const guildID = u.split('|')[1];

        const guild = container.client.guilds.cache.get(guildID);
        const discordUser = await container.client.users.fetch(user, {
            cache: false,
        });

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
            if (ui.id == u.split('|')[2]) {
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
        usersWithItemsExpiring.splice(len, 1);
        container.logger.info(
            `Removed item "${u.split('|')[2]}" from user ${discordUser.tag}.`
        );
    }

    if (usersWithItemsExpiring.length == 0) {
        await container.redis?.del(`usersWithItemsExpiring`);
    } else {
        await container.redis?.set(
            `usersWithItemsExpiring`,
            usersWithItemsExpiring.join(',')
        );
    }

    await container.redis?.del(`runningEconomyCronJob`);
    container.logger.info(`Done running economy cron job.`);
}

module.exports = { run };