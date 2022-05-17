const {
    InteractionHandler,
    InteractionHandlerTypes,
} = require('@sapphire/framework');
const {
    ButtonInteraction,
    MessageEmbed,
    User,
} = require('discord.js');

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
            interaction.message.components[0].components.forEach(component => {
                component.setDisabled(true);
            });
            return interaction.message.reply('Cancelled.');
        }

        const user = await this.container.client.users.fetch(userID).catch(() => null);
        if (!user) return;
        interaction.message.components[0].components.forEach(component => {
            component.setDisabled(true);
        });

        await this.container.redis.hdel('messages', userID);
            
        const embed = new MessageEmbed()
            .setColor('DARK_RED')
            .setTitle('Message Count Reset')
            .setDescription(`${user}'s message count has been reset.`);

        return interaction.message.reply({embeds: [embed]});
    }

    /**
     * 
     * @param { ButtonInteraction } interaction 
     */
    async parse(interaction) {
        if (!interaction.customId.toLowerCase().startsWith('resetmessages')) return this.none();
        
        return this.some();
    }
}

module.export = { ResetMessagesButtonHandler };