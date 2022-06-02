const { EconomyManager } = require('quick.eco');
const { items } = require('../../economy.config.json');
const { Database } = require('quickmongo');
const { container } = require('@sapphire/pieces');

class EconomyShop {
    constructor() {
        this.db = new Database(process.env.MONGO_URI);
        this.connected = false;
    }

    async _connect() {
        if(this.connected) return;
        await this.db.connect();
        this.connected = true;
    }

    async getData(userID, guildID) {
        if (!this.connected) await this._connect();
        const n = `userData.${userID}.${guildID}`;

        const d = await this.db.get(`${n}`);
        if (!d) {
            const data = {
                shopItems: [],
                createdAt: new Date().toString(),
            };

            await this.db.set(n, data);
            return {
                newUser: true,
                ...data,
            };
        } else {
            return {
                newUser: false,
                ...d,
            };
        }
    }

    async getItems(userID, guildID) {
        if (!this.connected) await this._connect();
        const n = `userData.${userID}.${guildID}.shopItems`;

        // Doing this so it puts the user in the database if they don't exist.
        await this.getData(userID, guildID);

        const items = await this.db.get(n);
        return items;
    }

    async hasItems(userID, guildID, items) {
        if (!this.connected) await this._connect();
        const n = `userData.${userID}.${guildID}.shopItems`;

        // Doing this so it puts the user in the database if they don't exist.
        await this.getData(userID, guildID);

        const userItems = await this.db.get(n);
        const itemsTheyHave = items.filter((i) => {
            return userItems.some((it) => it.id == i.id);
        });

        return itemsTheyHave.length > 0;
    }

    async addItems(userID, guildID, ...data) {
        if (!this.connected) await this._connect();
        const n = `userData.${userID}.${guildID}.shopItems`;

        // Doing this so it puts the user in the database if they don't exist.
        await this.getData(userID, guildID);

        for (var i = 0; i < data.length; ++i) {
            await this.db.push(n, data[i]);
        }

        const items = await this.db.get(n);
        return items;
    }

    async setItems(userID, guildID, items) {
        if (!this.connected) await this._connect();
        const n = `userData.${userID}.${guildID}.shopItems`;

        // Doing this so it puts the user in the database if they don't exist.
        await this.getData(userID, guildID);

        await this.db.set(n, items);

        const i = await this.db.get(n);
        return i;
    }
}

class Economy {
    constructor() {
        this.ecoDB = new EconomyManager({
            adapter: 'mongo',
            adapterOptions: {
                collection: `economy-${process.env['NODE_ENV'] || 'dev'}`, // => Collection Name
                uri: process.env.MONGO_URI,
            },
        });

        this.shop = new EconomyShop();
    }

    async getUserMultiplier(userID, guildID) {
        const globalMultiplier = await container.redis?.get(`globalMultiplier`);
        if (globalMultiplier) return parseInt(globalMultiplier);

        const items = await this.shop.getItems(userID, guildID);
        const multipliers = items.filter(
            (i) => typeof i.multiplier == 'number'
        );
        if (multipliers.length == 0) return 1;

        const multiplier = multipliers[0];
        const multiplierItem = items.filter((i) => i.id == multiplier.id);
        if (multiplierItem.length == 0) return 1;

        const item = multiplierItem[0];
        return item.multiplier;
    }

    async fixEconomyExpiringBug(guildID) {
        await this.shop._connect();
        const data = await container.redis.get(`usersWithItemsExpiring`);
        if(!data) return;
        const ids = data.split('|');
        for (var i = 0; i < ids.length; i++) {
            const id = ids[i];
            const user = await container.client.users.fetch(id);
            if (!user) continue;

            const shopItems = await this.shop.getItems(id, guildID);
            const indexesToDelete = [];
            const _ = shopItems.filter((i, index) => {
                const expires = items.filter((itemFromConfig) => itemFromConfig.id == i.id && itemFromConfig.expires);
                if(expires.length > 0) {
                    indexesToDelete.push(index);
                };

                return false
            }); 

            for(var i = 0; i < indexesToDelete.length; i++) {
                const index = indexesToDelete[i];
                const role = items.filter((itemFromConfig) => itemFromConfig.id == shopItems[index].id)[0].role;
                if(role) {
                    const guild = await container.client.guilds.fetch(guildID);
                    const member = await guild.members.fetch(user.id);
                    await member.roles.remove(role);
                };

                shopItems.splice(index, 1);
            };

            await this.shop.setItems(id, guildID, shopItems);
        };
        
    };

}

module.exports = { Economy };
