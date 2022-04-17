const { Precondition } = require('@sapphire/framework');
const { Permissions } = require('discord.js');
const { testingServerID } = require('../../config.json');

class AdminPrecondition extends Precondition {
    messageRun(message) {
        if (message.guild.id === testingServerID) return this.ok();
        return message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
            ? this.ok()
            : this.error('User is not an admin');
    }
}

module.exports = { AdminPrecondition };
