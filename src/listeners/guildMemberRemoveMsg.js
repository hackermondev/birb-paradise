const { Listener, Events } = require("@sapphire/framework");
const { GuildMember, MessageEmbed, WebhookClient } = require("discord.js");
const { memberLeaveChannel } = require("../../config.json");

class GuildMemberRemoveMsg extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: Events.GuildMemberRemove,
    });
  }

  /**
   *
   * @param { GuildMember } member
   */
  async run(member) {
	return member.guild.channels.cache.get(memberLeaveChannel).send(`**${member.user.tag} just left the server, sadge :verysadbirb:`);
  }
}

module.exports = { GuildMemberRemoveMsg };
