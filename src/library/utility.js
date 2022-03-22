const { GuildMember, Guild } = require('discord.js');
const { container } = require('@sapphire/pieces');

const { staffRoles, bpGuildID } = require('../../config.json');

class Utility {
    constructor() {
        container.utility = this;
    }

    /**
     *
     * @param { GuildMember } member
     * @returns
     */
    async isStaffMember(member) {
        if (member.permissions.has('ADMINISTRATOR')) return true;
        return staffRoles.some((role) => member.roles.cache.has(role));
    }

    /**
     *
     * @param { Guild } guild
     */
    async isBp(guild) {
        return guild.id === bpGuildID;
    }
}

module.exports = { Utility };
