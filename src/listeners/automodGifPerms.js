const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { staffRoles } = require('../../config.json');

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
        if (staffRoles.some(role => message.member.roles.cache.has(role))) return;
        
    }
}