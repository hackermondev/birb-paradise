const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { Interaction, ButtonInteraction, MessageEmbed, GuildMember } = require('discord.js');
const Sentry = require('@sentry/node');
const {
    bpPingRoles,
    bpVerifiedRole,
    colorRoles,
} = require('../../../config.json');

class ReactionRolesButtonHandler extends InteractionHandler {
	constructor(ctx) {
		super(ctx, { interactionHandlerType: InteractionHandlerTypes.Button });
	}

	/**
	 * 
	 * @param { ButtonInteraction } interaction 
	 */
	async run(interaction) {
		switch (interaction.customId) {
            // bp reaction role cases
            case 'giveaway':
                if (!interaction.member.roles.cache.has(bpPingRoles[0])) {
                    interaction.member.roles.add(
                        bpPingRoles[0],
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
                        bpPingRoles[0],
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
                if (!interaction.member.roles.cache.has(bpPingRoles[1])) {
                    interaction.member.roles.add(
                        bpPingRoles[1],
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
                        bpPingRoles[1],
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
                if (!interaction.member.roles.cache.has(bpPingRoles[2])) {
                    interaction.member.roles.add(
                        bpPingRoles[2],
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
                        bpPingRoles[2],
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
                if (!interaction.member.roles.cache.has(bpPingRoles[3])) {
                    interaction.member.roles.add(
                        bpPingRoles[3],
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
                        bpPingRoles[3],
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
                if (!interaction.member.roles.cache.has(bpPingRoles[4])) {
                    interaction.member.roles.add(
                        bpPingRoles[4],
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
                        bpPingRoles[4],
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
                if (!interaction.member.roles.cache.has(bpPingRoles[6])) {
                    interaction.member.roles.add(
                        bpPingRoles[6],
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
                        bpPingRoles[6],
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
                if (!interaction.member.roles.cache.has(bpPingRoles[5])) {
                    interaction.member.roles.add(
                        bpPingRoles[5],
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
                        bpPingRoles[5],
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

            // bp verify reaction role case
            case 'verify':
                if (!interaction.member.roles.cache.has(bpVerifiedRole)) {
                    interaction.member.roles.add(
                        bpVerifiedRole,
                        'verification'
                    );
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

            // bp color role cases
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
                        removeOtherColorRoles(interaction.member);
                    }
                    interaction.member.roles.add(
                        colorRoles[0],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the Green color role '
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
                                    'Successfully removed the Green color role '
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
                        removeOtherColorRoles(interaction.member);
                    }
                    interaction.member.roles.add(
                        colorRoles[1],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the Gold color role '
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
                                    'Successfully removed the Gold color role '
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
                        removeOtherColorRoles(interaction.member);
                    }
                    interaction.member.roles.add(
                        colorRoles[2],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the Red color role '
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
                                    'Successfully removed the Red color role '
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
                        removeOtherColorRoles(interaction.member);
                    }
                    interaction.member.roles.add(
                        colorRoles[3],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the White color role '
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
                                    'Successfully removed the White color role '
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
                        removeOtherColorRoles(interaction.member);
                    }
                    interaction.member.roles.add(
                        colorRoles[4],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the Pink color role '
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
                                    'Successfully removed the Pink color role '
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
                        removeOtherColorRoles(interaction.member);
                    }
                    interaction.member.roles.add(
                        colorRoles[5],
                        'Color reaction role add'
                    );
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    'Successfully added the Blue color role '
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
                                    'Successfully removed the Blue color role '
                                )
                                .setColor('RED'),
                        ],
                    });
                }
        }
	}

	/**
	 * @param { ButtonInteraction } interaction
	 */
	async parse(interaction) {
		await interaction.deferReply(); // defer reply and then call run
		return this.some();
	}
}

module.exports = { ReactionRolesButtonHandler };

/**
 *
 * @param { GuildMember } member
 */
 function removeOtherColorRoles(member) {
    colorRoles.forEach((role) => {
        member.roles.remove(role, 'Removing other color roles');
    });
}