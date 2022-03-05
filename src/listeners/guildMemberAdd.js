const { Listener } = require('@sapphire/framework');
const { GuildMember } = require('discord.js');

class guildMemberAddListener extends Listener {
  constructor(context, options) {
      super(context, {
        ...options,
        once: true,
        event: 'guildMemberAdd'
      });
    }

	/**
	 * 
	 * @param { GuildMember} member 
	 */
	run(member) {
		// TODO event handler
	}
}

module.exports = { guildMemberAddListener };