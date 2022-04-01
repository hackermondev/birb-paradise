const { Command, Args } = require('@sapphire/framework');
const { Stopwatch } = require('@sapphire/stopwatch');
const { Message } = require('discord.js');
class TestArgsCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'testargs',
            description: 'Tests stuff',
            preconditions: ['Developer'],
			flags: ['force', 'test']
        });
    }

    /**
     *
     * @param { Message } message
	 * @param { Args } args
     * @returns
     */
    async messageRun(message, args) {
		const argsRest = await args.restResult('string');
        const argsPick = await args.pickResult('string');
		if (!argsRest.success) return this.container.utility.errorReply(message, 'No args');
		else {
			if (args.getFlags('force')) message.channel.send('Force flag detected');
			if (args.getFlags('test')) message.channel.send('Test flag detected');
			message.channel.send(`argsRest: \`${argsRest}\``);
			message.channel.send(`argsPick: \`${argsPick}\``);
		}
    }
}

module.exports = { TestArgsCommand };
