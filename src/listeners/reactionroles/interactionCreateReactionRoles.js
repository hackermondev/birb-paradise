const { Listener, Events } = require('@sapphire/framework');
const { Interaction, MessageEmbed } = require('discord.js');
const Sentry = require('@sentry/node');
const { pingRoles } = require('../../../config.json');

class InteractionCreateReactionRolesListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.InteractionCreate,
        });
    }

    /**
     *
     * @param { Interaction } interaction
     */
    async run(interaction) {
        if (!interaction.isButton()) return;
        await interaction.deferReply({ephemeral: true});
        switch (interaction.customId) {
            case 'giveaway':
                if (!interaction.member.roles.cache.has(pingRoles[0])) {
                    interaction.member.roles.add(pingRoles[0]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added Giveaway Ping'
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(pingRoles[0]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed Giveaway Ping'
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'announcement':
                if (!interaction.member.roles.cache.has(pingRoles[1])) {
                    interaction.member.roles.add(pingRoles[1]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added Announcement Ping'
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(pingRoles[1]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed Announcement Ping'
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'event':
                if (!interaction.member.roles.cache.has(pingRoles[2])) {
                    interaction.member.roles.add(pingRoles[2]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription('Successfully added Event Ping')
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(pingRoles[2]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed Event Ping'
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'upload':
                if (!interaction.member.roles.cache.has(pingRoles[3])) {
                    interaction.member.roles.add(pingRoles[3]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added Upload Ping'
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(pingRoles[3]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed Upload Ping'
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'update':
                if (!interaction.member.roles.cache.has(pingRoles[4])) {
                    interaction.member.roles.add(pingRoles[4]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added Update Ping'
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(pingRoles[4]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed Update Ping'
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'bumper':
                if (!interaction.member.roles.cache.has(pingRoles[5])) {
                    interaction.member.roles.add(pingRoles[5]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added Bumper Birbs Ping'
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(pingRoles[5]);
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed Bumper Birbs Ping'
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            default:
                Sentry.captureMessage(
                    'Unknown Interaction(interactionCreateReactionRoles.js',
                    Sentry.Severity.Warning
                );
        }
    }
}

module.exports = { InteractionCreateReactionRolesListener };
