const { Command } = require('@sapphire/framework');
const { Message } = require('discord.js');

class FoodCommand extends Command {
	constructor(context, options) {
		super(context, {
		    ...options,
		    name: 'food',
		    preconditions: ['Staff'],
		    description: 'food!',
		});
	}

    /**
     * 
     * @param { Message } message 
     */
    async messageRun(message) {
        return message.reply('https://tenor.com/view/cute-bird-parrot-perroquet-oiseau-gif-13534334');
    }
}

module.exports = { FoodCommand };