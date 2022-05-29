const { Command, Args, container } = require('@sapphire/framework');
const { Message } = require('discord.js');

class GlobalMultiplierCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'setglobalmultiplier',
            preconditions: ['Admin'],
            description: 'Sets the global multiplier for the server.',
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

        if (multiplierArg.success) multiplier = multiplierArg.value;

        if (multiplier < 0) {
            await container.redis?.del(`globalMultiplier`);
            return message.reply(`Global multiplier has been reset.`);
        }

        await container.redis?.set(`globalMultiplier`, multiplier);
        message.reply(`Global multiplier has been set to ${multiplier}`);
    }
}

module.exports = { GlobalMultiplierCommand };
