const { Listener } = require("@sapphire/framework");
const { Message } = require("discord.js");
const { reactChannels } = require("../../config.json");

class MessageReactBarneySuggestions extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "messageReactChannels",
      once: false,
      event: "messageCreate",
    });
  }

  /**
   *
   * @param { Message } message
   */
  async run(message) {
    if (!reactChannels.includes(message.channelId)) return;
    if (message.author.id === message.guild.ownerId) return;
    return message.react("👍").then(message.react("👎"));
  }
}

module.exports = { MessageReactBarneySuggestions };