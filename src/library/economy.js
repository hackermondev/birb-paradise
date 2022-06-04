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


    async removeItems(userID, guildID, itemID, amount=1) {
        if (!this.connected) await this._connect();
        const n = `userData.${userID}.${guildID}.shopItems`;

        // Doing this so it puts the user in the database if they don't exist.
        await this.getData(userID, guildID);

        const userItems = await this.db.get(n);
        const indexes = [];
        let a = 0;

        for(var i = 0; i < userItems.length; i++) {
            if(userItems[i].id == itemID && a < amount) {
                indexes.push(i);
                a++;
            };
        };

        for(var i = 0; i < indexes.length; i++) {
            userItems.splice(indexes[i], 1);
        };

        await this.db.set(n, userItems);
        return true;
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

    convertTextToString(text) {
        if (typeof text != 'string') return 0;

        const number = parseInt(text);
        if (isNaN(number)) return 0;

        const last = text.slice(-1);
        if (last == 'k') return number * 1000;
        if (last == 'm') return number * 1000000;
        if (last == 'b') return number * 1000000000;

        return number;
    }
}

module.exports = { Economy };
