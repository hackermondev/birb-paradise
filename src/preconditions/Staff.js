const { Precondition } = require('@sapphire/framework');
const { staffRoles } = require('../../config.json');

class StaffPrecondition extends Precondition {
	run(message) {
		return staffRoles.some(role => message.member.roles.has(role)) ? this.ok() : this.error();
	}
}
module.exports = { StaffPrecondition };