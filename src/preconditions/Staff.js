const { Precondition } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { staffRoles } = require('../../config.json');

class StaffPrecondition extends Precondition {
	/**
	 * 
	 * @param { Message } message 
	 * @returns 
	 */
	run(message) {
		return staffRoles.some(role => message.member.roles.cache.has(role)) ? this.ok() : this.error();
	}
}
module.exports = { StaffPrecondition };