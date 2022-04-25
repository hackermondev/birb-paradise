const { Listener, Events } = require('@sapphire/framework');
const { GuildMember } = require('discord.js');

class MemberJoinCountListener extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'memberJoinCount',
			event: Events.GuildMemberAdd,
		});
	}

	/**
	 * 
	 * @param { GuildMember } member 
	 */
	async run(member) {
		if (!this.container.utility.isBp(member.guild)) return;
		
		const joinCount = await this.container.redis.get('dailyJoinCount');
		if (!joinCount) return this.container.redis.set('dailyJoinCount', 1);
		else return this.container.redis.set('dailyJoinCount', Number.parseInt(joinCount) + 1);
	}
}

module.exports = { MemberJoinCountListener };