const { Listener, Events } = require('@sapphire/framework');
const { GuildMember, MessageEmbed, WebhookClient } = require('discord.js');
const { accountAgeLogWebhookID } = require('../../config.json');
const { accountAgeLogWebhookToken } = require('../../config.json');

class GuildMemberAddAccountAgeKickListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true,
            event: Events.GuildMemberAdd,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        const accountAgeKickEmbed = new MessageEmbed()
            .setTitle(
                `Your account was kicked from ${member.guild.name} for having an account age below the threshold`
            )
            .setDescription(`Try joining again in a few days`);
        const accountAgeLogEmbed = new MessageEmbed()
            .setTitle('A user was kicked since their account was too young')
            .addField('User', `<@${member.id}>`)
            .addField('Time', `<t:${Math.floor(Date.now() / 1000)}>`)
            .addField(
                'Account Created',
                `<t:${member.user.createdAt.getTime()}:R>`
            );
        if (Date.now() - member.user.createdAt < 86400000) {
            await member
                .send({ embeds: [accountAgeKickEmbed] })
                .catch(() => {});
            await member.kick('Account was less than 1d old');
            const webhookClient = new WebhookClient({
                id: accountAgeLogWebhookID,
                token: accountAgeLogWebhookToken,
            });
            return webhookClient.send({ embeds: [accountAgeLogEmbed] });
        } else return;
    }
}

module.exports = { GuildMemberAddAccountAgeKickListener };
