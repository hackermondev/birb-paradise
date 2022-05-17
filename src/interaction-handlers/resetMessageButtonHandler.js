const {
    InteractionHandler,
    InteractionHandlerTypes,
} = require('@sapphire/framework');
const { ButtonInteraction, MessageEmbed, User } = require('discord.js');

class ResetMessagesButtonHandler extends InteractionHandler {
    constructor(ctx) {
        super(ctx, { interactionHandlerType: InteractionHandlerTypes.Button });
    }

    /**
     *
     * @param { ButtonInteraction } interaction
     */
    async run(interaction) {
        const [type, userID] = interaction.customId.split('-');
        const isYes = type.toLowerCase().endsWith('yes');

        if (!isYes) {
            interaction.message.components = [];
            interaction.message.edit(
                `${interaction.message.content} \n This action was cancelled.`
            );
            return interaction.reply('Cancelled.');
        }

        const user = await this.container.client.users
            .fetch(userID)
            .catch(() => null);
        if (!user) return;

        interaction.message.components = [];
        interaction.message.edit(
            `${interaction.message.content} \n This action was confirmed.`
        );
        await this.container.redis.hdel('messages', userID);

        const embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setTitle('Message Count Reset')
            .setDescription(`${user}'s message count has been reset.`);

        return interaction.reply({ embeds: [embed] });
    }

    /**
     *
     * @param { ButtonInteraction } interaction
     */
    async parse(interaction) {
        if (!interaction.customId.toLowerCase().startsWith('resetmessages'))
            return this.none();

        return this.some();
    }
}

module.exports = { ResetMessagesButtonHandler };
