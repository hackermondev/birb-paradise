const { Listener, Events } = require('@sapphire/framework');
const { Interaction } = require('discord.js');
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
        switch (interaction.customId) {
            case 'giveaway':
                
                break;
            case 'announcement':

                break;
            case 'event':

                break;
            case 'update':

                break;
            case 'upload':

                break;
            case 'upload':

                break;
            case 'bumper':

                break;
            default:
                break;
        }
    }
}

module.exports = { InteractionCreateReactionRolesListener };