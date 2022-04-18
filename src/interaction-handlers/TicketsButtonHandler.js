const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { ButtonInteraction, MessageEmbed } = require('discord.js');
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
		// TODO handle button clicks
		// create a channel and send an embed, lock it to mods or admins accordingly etc.
		switch (interaction.customId) {
			case 'tickets_general':
				
				break;
			case 'tickets_userReport':

				break;
			case 'tickets_partner':

				break;
			case 'tickets_reportStaff':

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
	}

	/**
	 * 
	 * @param { ButtonInteraction } interaction 
	 */
	async parse(interaction) {
		if (!interaction.customId.startsWith('tickets')) return this.none(); // exit if not part of the ticket system
		await interaction.deferReply();
		return this.some();
	}
}

module.exports = { TicketsButtonHandler };