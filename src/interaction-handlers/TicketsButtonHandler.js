const {
    InteractionHandler,
    InteractionHandlerTypes,
    container,
} = require('@sapphire/framework');
const {
    ButtonInteraction,
    MessageEmbed,
    MessageButton,
    MessageActionRow,
} = require('discord.js');
const { ticketsCategoryID, noTicketsRole } = require('../../config.json');
const Sentry = require('@sentry/node');

class TicketsButtonHandler extends InteractionHandler {
    constructor(ctx) {
        super(ctx, { interactionHandlerType: InteractionHandlerTypes.Button });
    }

    /**
     *
     * @param { ButtonInteraction } interaction
     */
    async run(interaction) {
        let channel = null;

        if (
            [
                'tickets_general',
                'tickets_userReport',
                'tickets_partner',
                'tickets_reportStaff',
            ].includes(interaction.customId)
        ) {
            channel = await interaction.guild.channels.create (
                `${interaction.user.tag}-ticket`,
                {
                    topic: `Reason: "${interaction.customId.split('_').join(' ')}" . Created by ${interaction.user}.`,
                }
            );

            // await channel.lockPermissions();
            await channel.permissionOverwrites.create(interaction.member, {
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
            });
        }

        let data = ``;
        switch (interaction.customId) {
            case 'tickets_general':
                data = `${interaction.user} created a ticket for general reason.`;
                break;
            case 'tickets_userReport':
                data = `${interaction.user} created a ticket for a user report.`;
                break;
            case 'tickets_partner':
                data = `${interaction.user} created a ticket for a server partnership.`;
                break;
            case 'tickets_reportStaff':
                data = `${interaction.user} created a ticket to report staff.`;
                break;
            case 'tickets_close':
                const isTicket = await container.redis.get(
                    `bp/ticket/${interaction.user.id}/${interaction.channel.id}`
                );
                if (!isTicket && !this.container.utility.isStaffMember(interaction.member))
                    return interaction.followUp({
                        content: `You do not have permission to close this ticket.`,
                    });

                await interaction.followUp({
                    content: `Closing ticket in 10 seconds...`,
                });
                await interaction.channel.send({
                    content: `Closing ticket in 10 seconds...`,
                });

                setTimeout(
                    () =>
                        interaction.channel.delete() &&
                        container.redis.del(
                            `bp/ticket/${interaction.user.id}/${interaction.channel.id}`
                        ),
                    10 * 1000
                );
                break;
            default:
                interaction.followUp({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(
                                'An error occured. Please try again later'
                            )
                            .setColor('RED'),
                    ],
                });
                return Sentry.captureEvent(interaction);
        }

        if (data != '') {
            const c = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('tickets_close')
                    .setLabel('Close Ticket')
                    .setStyle('DANGER')
            );

            await channel.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(data)
                        .setColor('GOLD')
                        .setTimestamp()
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],

                components: [c],
            });

            await container.redis.set(
                `bp/ticket/${interaction.user.id}/${channel.id}`,
                1
            );
            await interaction.followUp({
                content: `Your ticket has been successfully created: ${channel}.`,
            });
        }
    }

    /**
     *
     * @param { ButtonInteraction } interaction
     */
    async parse(interaction) {
        if (!interaction.customId.startsWith('tickets')) return this.none(); // exit if not part of the ticket system
        if (interaction.member.roles.cache.has(noTicketsRole))
            return interaction.reply('You are blacklisted from creating tickets', { ephemeral: true }); // no tickets role


        await interaction.deferReply({
            ephemeral: true,
        });

        return this.some();
    }
}

module.exports = { TicketsButtonHandler };
