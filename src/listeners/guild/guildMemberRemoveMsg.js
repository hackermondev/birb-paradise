const { Listener, Events } = require("@sapphire/framework");
const { GuildMember } = require("discord.js");
const { memberLeaveChannel } = require("../../config.json");

class GuildMemberRemoveMsg extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      event: Events.GuildMemberRemove,
    });
  }

  /**
   *
   * @param { GuildMember } member
   */
  async run(member) {
    const ch = member.guild.channels.cache.get(memberLeaveChannel);
    if (!ch || ch.type != 'GUILD_TEXT') return;
	  return ch.send(`**${member.user.tag} just left the server, sadge :verysadbirb:`);
  }
}

module.exports = { GuildMemberRemoveMsg };
