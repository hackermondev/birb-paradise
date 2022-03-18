const { Listener, Events } = require('@sapphire/framework');
const { Sentry } = require('@sentry/node');
const { Message } = require('discord.js');
const { staffRoles, gifPermRoles } = require('../../config.json');
const linkRegex = new RegExp("");

class AutomodGifPermsListener extends Listener {
	constructor(context, options) {
        super(context, {
            ...options,
            name: 'automodGifPerms',
            once: false,
            event: Events.MessageCreate,
            enabled: false,
        });
    }

    /**
     * 
     * @param { Message } message 
     */
    async run(message) {
        if (staffRoles.some(role => message.member.roles.cache.has(role))) return;
        if (gifPermRoles.some(role => message.member.roles.cache.has(role))) return;
        
        if (!linkRegex.test(message.content)) return;

        if (message.deletable) {
            await message.delete();
            const automodMsg = await message.channel.send('You do not have permissions to send gifs in this channel');
            setTimeout(() => automodMsg.delete(), 4500);
        }
    }
}

module.exports = { AutomodGifPermsListener };