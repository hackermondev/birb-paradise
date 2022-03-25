const { Listener, Events } = require('@sapphire/framework');
const { GuildMember } = require('discord.js');
const { dividerPingRole } = require('../../../config.json');

class DividerRoleAdd extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'dividerRoleAdd',
            event: Events.GuildMemberAdd,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        setTimeout(() => {
            await member.roles.add(dividerPingRole, 'Adding divider ping role').catch(() => {});
        }, 600000);
    }
}
