const { Command, Args } = require('@sapphire/framework');
const {
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} = require('discord.js');

class ConfigReactionRolesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'configreactionroles',
            aliases: ['configrr'],
            description: 'Configures or shows you the current automod settings',
            preconditions: ['Admin'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const ch = await args.pickResult('guildTextChannel');
        if (!ch.success)
            return this.container.utility.errorReply(
                message,
                'You must provide a valid channel to send the reaction role embed in'
            );

        const c1 = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Giveaway Ping')
                .setCustomId('giveaway')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setLabel('Bot Giveaway Ping')
                .setCustomId('botgiveaway')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setLabel('Announcement Ping')
                .setCustomId('announcement')
                .setStyle('SUCCESS')
        );

        const c2 = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Event Ping')
                .setCustomId('event')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setLabel('Upload Ping')
                .setCustomId('upload')
                .setStyle('SUCCESS')
        );

        const c3 = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel('Bumper Ping')
                .setCustomId('bumper')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setLabel('Partnership Ping')
                .setCustomId('partnership')
                .setStyle('SUCCESS')
        );

        const rrEmbed = new MessageEmbed()
            .setTitle(`${message.guild.name} Ping Roles`)
            .setColor('BLURPLE')
            .setDescription(
                'Use the buttons below to get reaction roles to get pinged for specific things that happen in the server!'
            )
            .setFooter({
                text: message.guild.name,
                iconURL: message.guild.iconURL(),
            });

        await ch.value.send({ embeds: [rrEmbed], components: [c1, c2, c3] });
        return message.reply('The reaction role embed has been sent');
    }
}

module.exports = { ConfigReactionRolesCommand };
