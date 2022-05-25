const { Listener, Events } = require('@sapphire/framework');
const { GuildMember } = require('discord.js');
const { bpVerifiedRole } = require('../../../config.json');

class AutoRoleListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'autoRoleAdd',
            event: Events.GuildMemberAdd,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        if (!this.container.utility.isBp(member.guild)) return;
        return member.roles.add(bpVerifiedRole, 'Autorole on join');
    }
}

module.exports = { AutoRoleListener };
