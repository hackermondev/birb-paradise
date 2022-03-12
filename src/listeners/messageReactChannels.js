const { Listener } = require("@sapphire/framework");
const { Message } = require("discord.js");

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
    if (message.channelId !== "927983294853816330" || "913138419142651934") return;
    if (message.author.id === message.guild.ownerId) return;
    return message.react("👍").then(message.react("👎"));
  }
}

module.exports = { MessageReactBarneySuggestions };
