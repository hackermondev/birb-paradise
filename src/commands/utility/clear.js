const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class ClearCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'clear',
			description: 'Purges a number of messages from a channel.',
			preconditions: ['Staff'],
			aliases: ['prune', 'delete', 'purge'],
		});
	}

	/**
	 * 
	 * @param { Message } message 
	 * @param { Args } args 
	 */
	async messageRun(message, args) {
		const num = await args.pickResult('integer');
		if (!num.success) return this.container.utility.errorReply(message, 'You must provide a number of messages to clear.');

		const rawChannel = await args.pickResult('guildTextChannel');
		const channel = rawChannel.value ?? message.channel;

		if (message.deletable) await message.delete();
		
		const msgs = await channel.messages.fetch({ limit: num.value });
		
		await channel.bulkDelete(msgs);

		return message.channel.send(`Cleared ${num.value} messages ${rawChannel.success ? rawChannel.value.toString() : ''}.`).then((reply) => setTimeout(() => reply.delete(), 3500));
	}
}

module.exports = { ClearCommand }; 