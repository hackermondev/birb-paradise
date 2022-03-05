const { Precondition } = require('@sapphire/framework');
const { Message } = require('discord.js');

class SpinachPrecondition extends Precondition {

	/**
	 * 
	 * @param { Message } message 
	 * @returns 
	 */
	run(message) {
		return message.author.id === '871531078391853158' ? this.ok() : this.error();
	}
}

module.exports = { SpinachPrecondition }