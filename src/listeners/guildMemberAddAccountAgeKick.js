const { Listener } = require('@sapphire/framework');
const { GuildMember, MessageEmbed } = require('discord.js');

class GuildMemberAddAccountAgeKickListener extends Listener {
  constructor(context, options) {
      super(context, {
        ...options,
        once: true,
        event: 'guildMemberAdd'
      });
    }

	/**
	 * 
	 * @param { GuildMember } member 
	 */
	async run(member) {
		const accountAgeKickEmbed = new MessageEmbed()
			.setTitle(`Your account was kicked from ${member.guild.name} for having an account age below the threshold`)
			.setDescription(`Try joining again in a few days`)
		if ((Date.now() - member.user.createdAt) < 86400000) {
			await member.send({embeds: [accountAgeKickEmbed]}).catch(() => {});
			await member.kick("Account was less than 1d old");
			await 
		}
	}
}

module.exports = { guildMemberAddListener };