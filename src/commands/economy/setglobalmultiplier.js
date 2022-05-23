const { Command, Args, container } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { coinEmoji } = require('../../../economy.config.json');
const { SimpleEmbed, ErrorEmbed } = require('../../library/embeds');

class GlobalMultiplierCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'setglobalmultiplier',
            preconditions: ['Admin'],
            description: '(Economy) Set global multiplier for the server.',
            enabled: true,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const multiplierArg = await args.pickResult('number');
        let multiplier = 0;

        if (!multiplierArg.error) multiplier = multiplierArg.value;

        if (multiplier < 0) {
            await container.redis?.del(`globalMultiplier`);
            return message.reply(`Global multiplier has been reset.`);
        }

        await container.redis?.set(`globalMultiplier`, multiplier);
        message.reply(`Global multiplier has been set to ${multiplier}`);
    }
}

module.exports = { GlobalMultiplierCommand };
