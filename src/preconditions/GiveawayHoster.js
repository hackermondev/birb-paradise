const { Precondition } = require('@sapphire/framework');
const { Message, Permissions } = require('discord.js');
const {
    giveawayHosterRoles,
    giveawayChannels,
    testingServerID,
} = require('../../config.json');

class GiveawayHosterPrecondition extends Precondition {
    /**
     *
     * @param { Message } message
     * @returns
     */
    messageRun(message) {
        if (message.guild.id === testingServerID) return this.ok(); // return ok if testing server
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
            return this.ok();

        if (this.container.utility.isStaffMember(message.member))
            return this.ok();

        let hasRole = giveawayHosterRoles.some((role) =>
            message.member.roles.cache.has(role)
        );
        if (!hasRole) return this.error('User is not a giveaway hoster');

        let inChannel = giveawayChannels.some(
            (channel) => message.channel.id === channel
        );
        if (!inChannel) return this.error('User is not in a giveaway channel');

        return this.ok();
    }
}

module.exports = { GiveawayHosterPrecondition };
