const { Command, Args } = require('@sapphire/framework');
const { Message, User } = require('discord.js');

class AfkCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'afk',
			aliases: ['away'],
			preconditions: ['Staff'],
			description: 'Set your afk status to a specified reason.',
		})
	}

	/**
	 * 
	 * @param { Message } message 
	 * @param { Args } args
	 */
	async messageRun(message, args) {
		const rawReason = await args.restResult('string');

		if (rawReason.value?.length > 100) return this.container.utility.errorReply(message, 'Your AFK reason cannot be longer than 100 characters.');

		const reason = rawReason.value ?? 'No reason provided.';

		await this.setAFK(message.author, reason);

		return message.reply({content: `Your AFK status has been set. \`${reason}\``, allowedMentions: {users: [message.author.id], roles: [], parse: []}});
	}

	/**
	 * 
	 * @param { User } user 
	 * @param { String } reason 
	 */
	async setAFK(user, reason) {
		await this.container.redis.hset('afk', user.id, reason);
	}
}

module.exports = { AfkCommand };