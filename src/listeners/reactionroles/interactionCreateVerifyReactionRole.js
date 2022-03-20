const { Listener, Events } = require('@sapphire/framework');
const { Interaction, MessageEmbed } = require('discord.js');
const Sentry = require('@sentry/node');
const { verifiedRole } = require('../../../config.json');

class InteractionCreateVerifyReactionRoleListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: Events.InteractionCreate,
            enabled: false,
        });
    }

    /**
     *
     * @param { Interaction } interaction
     */
    async run(interaction) {}
}

module.exports = { InteractionCreateVerifyReactionRoleListener };
