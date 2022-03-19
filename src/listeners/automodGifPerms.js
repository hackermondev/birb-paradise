const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { staffRoles, gifPermRoles } = require('../../config.json');
const tenorDomains = ['https://tenor.com', 'https://c.tenor.com'];
class AutomodGifPermsListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'automodGifPerms',
            once: false,
            event: Events.MessageCreate,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async run(message) {
        if (staffRoles.some((role) => message.member.roles.cache.has(role)))
            return;
        if (gifPermRoles.some((role) => message.member.roles.cache.has(role)))
            return;

        if (!tenorDomains.some((domain) => message.content.startsWith(domain)))
            return;

        if (message.deletable) {
            await message.delete();
            const automodMsg = await message.channel.send(
                `${message.member.toString()}, You do not have permissions to send gifs in this channel`
            );
            setTimeout(() => automodMsg.delete(), 4500);
        }
    }
}

module.exports = { AutomodGifPermsListener };
