const { Precondition } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { staffRoles } = require('../../config.json');

class StaffPrecondition extends Precondition {
    /**
     *
     * @param { Message } message
     * @returns
     */
    messageRun(message) {
        if (message.guild.id === '895515788126072842') return this.ok();
        return staffRoles.some((role) => message.member.roles.cache.has(role))
            ? this.ok()
            : this.error('User is not a staff member');
    }
}
module.exports = { StaffPrecondition };
