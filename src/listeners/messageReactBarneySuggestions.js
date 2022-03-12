const { Listener } = require("@sapphire/framework");
const { Message } = require("discord.js");

class MessageReactBarneySuggestions extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "messageReactBarneySuggestions",
      once: false,
      event: "messageCreate",
    });
  }

  /**
   *
   * @param { Message } message
   */
  async run(message) {
    if (message.channelId !== "927983294853816330") return;
    return message.react("👍").then(message.react("👎"));
  }
}

module.exports = { MessageReactBarneySuggestions };
