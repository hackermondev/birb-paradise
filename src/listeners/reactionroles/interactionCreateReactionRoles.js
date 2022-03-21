const { Listener, Events } = require('@sapphire/framework');
const { Interaction, MessageEmbed, Message } = require('discord.js');
const Sentry = require('@sentry/node');
const { pingRoles, verifiedRole, colorRoles } = require('../../../config.json');

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
        await interaction.deferReply({ ephemeral: true });
        switch (interaction.customId) {
            // reaction role cases
            case 'giveaway':
                if (!interaction.member.roles.cache.has(pingRoles[0])) {
                    interaction.member.roles.add(
                        pingRoles[0],
                        'Reaction role add'
                    );
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
                    interaction.member.roles.remove(
                        pingRoles[0],
                        'Reaction role remove'
                    );
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
                    interaction.member.roles.add(
                        pingRoles[1],
                        'Reaction role add'
                    );
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
                    interaction.member.roles.remove(
                        pingRoles[1],
                        'Reaction role remove'
                    );
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
                    interaction.member.roles.add(
                        pingRoles[2],
                        'Reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription('Successfully added Event Ping')
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        pingRoles[2],
                        'Reaction role remove'
                    );
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
                    interaction.member.roles.add(
                        pingRoles[3],
                        'Reaction role add'
                    );
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
                    interaction.member.roles.remove(
                        pingRoles[3],
                        'Reaction role remove'
                    );
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
                    interaction.member.roles.add(
                        pingRoles[4],
                        'Reaction role add'
                    );
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
                    interaction.member.roles.remove(
                        pingRoles[4],
                        'Reaction role remove'
                    );
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
                if (!interaction.member.roles.cache.has(pingRoles[6])) {
                    interaction.member.roles.add(
                        pingRoles[6],
                        'Reaction role add'
                    );
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
                    interaction.member.roles.remove(
                        pingRoles[6],
                        'Reaction role remove'
                    );
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
            case 'partnership':
                if (!interaction.member.roles.cache.has(pingRoles[5])) {
                    interaction.member.roles.add(
                        pingRoles[5],
                        'Reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added Partnership Ping'
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        pingRoles[5],
                        'Reaction role remove'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed Partnership Ping'
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            // verify reaction role case
            case 'verify':
                if (!interaction.member.roles.cache.has(verifiedRole)) {
                    interaction.member.roles.add(verifiedRole, 'verification');
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription('You are now verified!')
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription('You are already verified!')
                                .setColor('RED'),
                        ],
                    });
                }
            // color role cases
            case 'green':
                if (
                    !interaction.member.roles.cache.some(
                        (role) => role.id === colorRoles[0]
                    )
                ) {
                    if (
                        interaction.member.roles.cache.some((role) =>
                            colorRoles.includes(role.id)
                        )
                    ) {
                        colorRoles.forEach((role) => {
                            interaction.member.roles.remove(
                                role,
                                'Removing other color roles'
                            );
                        });
                    }
                    interaction.member.roles.add(
                        colorRoles[0],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the green color role '
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        colorRoles[0],
                        'Color reaction role remove'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed the green color role '
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'gold':
                if (
                    !interaction.member.roles.cache.some(
                        (role) => role.id === colorRoles[1]
                    )
                ) {
                    if (
                        interaction.member.roles.cache.some((role) =>
                            colorRoles.includes(role.id)
                        )
                    ) {
                        colorRoles.forEach((role) => {
                            interaction.member.roles.remove(
                                role,
                                'Removing other color roles'
                            );
                        });
                    }
                    interaction.member.roles.add(
                        colorRoles[1],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the gold color role '
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        colorRoles[1],
                        'Color reaction role remove'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed the gold color role '
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'red':
                if (
                    !interaction.member.roles.cache.some(
                        (role) => role.id === colorRoles[2]
                    )
                ) {
                    if (
                        interaction.member.roles.cache.some((role) =>
                            colorRoles.includes(role.id)
                        )
                    ) {
                        colorRoles.forEach((role) => {
                            interaction.member.roles.remove(
                                role,
                                'Removing other color roles'
                            );
                        });
                    }
                    interaction.member.roles.add(
                        colorRoles[2],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the red color role '
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        colorRoles[2],
                        'Color reaction role remove'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed the red color role '
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'white':
                if (
                    !interaction.member.roles.cache.some(
                        (role) => role.id === colorRoles[3]
                    )
                ) {
                    if (
                        interaction.member.roles.cache.some((role) =>
                            colorRoles.includes(role.id)
                        )
                    ) {
                        colorRoles.forEach((role) => {
                            interaction.member.roles.remove(
                                role,
                                'Removing other color roles'
                            );
                        });
                    }
                    interaction.member.roles.add(
                        colorRoles[3],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the white color role '
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        colorRoles[3],
                        'Color reaction role remove'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed the white color role '
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'pink':
                if (
                    !interaction.member.roles.cache.some(
                        (role) => role.id === colorRoles[4]
                    )
                ) {
                    if (
                        interaction.member.roles.cache.some((role) =>
                            colorRoles.includes(role.id)
                        )
                    ) {
                        colorRoles.forEach((role) => {
                            interaction.member.roles.remove(
                                role,
                                'Removing other color roles'
                            );
                        });
                    }
                    interaction.member.roles.add(
                        colorRoles[4],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the pink color role '
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        colorRoles[4],
                        'Color reaction role remove'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed the pink color role '
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            case 'blue':
                if (
                    !interaction.member.roles.cache.some(
                        (role) => role.id === colorRoles[5]
                    )
                ) {
                    if (
                        interaction.member.roles.cache.some((role) =>
                            colorRoles.includes(role.id)
                        )
                    ) {
                        colorRoles.forEach((role) => {
                            interaction.member.roles.remove(
                                role,
                                'Removing other color roles'
                            );
                        });
                    }
                    interaction.member.roles.add(
                        colorRoles[5],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the blue color role '
                                )
                                .setColor('GREEN'),
                        ],
                    });
                } else {
                    interaction.member.roles.remove(
                        colorRoles[5],
                        'Color reaction role remove'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully removed the blue color role '
                                )
                                .setColor('RED'),
                        ],
                    });
                }
            default:
                Sentry.captureException(interaction);
                return interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(
                                'There was an error adding or removing a role. Please try again'
                            )
                            .setColor('ORANGE'),
                    ],
                });
        }
    }
}

module.exports = { InteractionCreateReactionRolesListener };
