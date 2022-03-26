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
        if (!this.container.utility.isBp(member.guild)) return;
        setTimeout(() => {
            member.roles
                .add(dividerPingRole, 'Adding divider ping role')
                .catch(() => {});
        }, 600000);
    }
}

module.exports = { DividerRoleAdd };