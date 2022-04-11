const { Precondition } = require('@sapphire/framework');
const { Permissions } = require('discord.js');

class AdminPrecondition extends Precondition {
    messageRun(message) {
        if (message.guild.id === '895515788126072842') return this.ok(); // return ok if testing server
        return message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
            ? this.ok()
            : this.error('User is not an admin');
    }
}

module.exports = { AdminPrecondition };
