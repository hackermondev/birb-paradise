const { Command, Args } = require('@sapphire/framework');
const {
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} = require('discord.js');

class TicketSetupCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ticketsetup',
            description: 'Show the ticket embed in the a specified channel.',
            preconditions: ['Admin'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const channel = await args.pickResult('guildTextChannel');
        if (!channel.success) return this.container.utility.errorReply('You must provide a valid text channel to send the ticket embed in');
        
        message.delete();
        const e = new MessageEmbed()
            .setDescription(
                `Open a ticket below!\n\nIf you would like to report a user, use the **Report User** button. Otherwise, please use the **General Support** button`
            )
            .setColor(`BLURPLE`);

        const c = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('tickets_general')
                .setLabel('General Support')
                .setStyle('PRIMARY'),

            new MessageButton()
                .setCustomId('tickets_userReport')
                .setLabel('User Report')
                .setStyle('PRIMARY'),

            new MessageButton()
                .setCustomId('tickets_partner')
                .setLabel('Server Partnership')
                .setStyle('PRIMARY'),

            new MessageButton()
                .setCustomId('tickets_reportStaff')
                .setLabel('Report Staff')
                .setStyle('PRIMARY')
        );

        channel.value.send({
            embeds: [e],
            components: [c],
        });
    }
}

module.exports = { TicketSetupCommand };
