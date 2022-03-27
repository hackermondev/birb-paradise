const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class DisableRaidPreventionCommand extends Command {
	constructor(context, options) {
        super(context, {
            ...options,
            name: 'disableraidprevention',
            preconditions: ['Admin'],
            description: 'Disables raid prevention',
        });
    }

    /**
     * 
     * @param { Message } message 
     */
    async messageRun(message) {
        this.container.stores.get('listeners').get('raidPrevention').unload();
        return message.reply('Raid Prevention is now disabled');
    }
}

module.exports = { DisableRaidPreventionCommand };