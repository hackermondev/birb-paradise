const { Precondition } = require('@sapphire/framework');

class AdminPrecondition extends Precondition {
	run(message) {
		return message.member.permissions.has('ADMINISTRATOR') ? this.ok() : this.error()
	}
}

module.exports = { AdminPrecondition }