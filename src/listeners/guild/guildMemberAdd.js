const { Listener, Events } = require('@sapphire/framework');
const { GuildMember } = require('discord.js');
const {
    bpVerifiedRole,
    accountAgeKickWebhookID,
    accountAgeKickWebhookToken,
} = require('../../../config.json');

class GuildMemberAddListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: Events.GuildMemberAdd,
            event: Events.GuildMemberAdd,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        await this.checkAccountAge(member);
        if (!member.guild) return;
        await this.autoRoleAdd(member);
    }

    /**
     *
     * @param { GuildMember } member
     */
    async autoRoleAdd(member) {
        if (!this.container.utility.isBp(member.guild)) return;
        const roleAdd = member.roles.add(bpVerifiedRole, 'Autorole on join');
        const roleTimeout = setTimeout(() => {
            member.roles
                .add(dividerPingRole, 'Adding divider ping role')
                .catch(() => {});
        }, 600000);
        return [roleAdd, roleTimeout];
    }

    /**
     *
     * @param { GuildMember } member
     */
    async checkAccountAge(member) {
        if (!this.container.utility.isBp(member.guild)) return;
        if (!accountAgeKickWebhookID || !accountAgeKickWebhookToken) return;

        const accountAgeKickEmbed = new MessageEmbed()
            .setTitle(
                `Your account was kicked from ${member.guild.name} for having an account age below the threshold`
            )
            .setDescription(`Try joining again in a few days`);
        const accountAgeLogEmbed = new MessageEmbed()
            .setTitle('A user was kicked since their account was too young')
            .setColor('DARK_RED')
            .addField('User', `<@${member.id}>`)
            .addField('Time', `<t:${Math.floor(Date.now() / 1000)}>`)
            .addField(
                'Account Created',
                `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`
            );
        if (Date.now() - member.user.createdAt < 86400000) {
            await member
                .send({ embeds: [accountAgeKickEmbed] })
                .catch(() => {});
            await member.kick('Account was less than 1d old');
            this.container.utility.sendWebhook(
                accountAgeKickWebhookID,
                accountAgeKickWebhookToken,
                accountAgeLogEmbed
            );
            return true;
        } else return false;
    }
}

module.exports = { GuildMemberAddListener };
