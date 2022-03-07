const { Command } = require("@sapphire/framework");
const { Message } = require("discord.js");

class BirbCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "birb",
      description: "birb",
      preconditions: ["Staff"],
    });
  }

  /**
   *
   * @param { Message } message
   */
  messageRun(message) {
    const birb_images = [
      "https://imgur.com/NNLsONt",
      "https://imgur.com/dkmpUGU",
      "https://imgur.com/jVGxKpE",
      "https://imgur.com/sspcIT3",
      "https://imgur.com/UxNV46p",
      "https://imgur.com/cTbZ9ny",
    ];
    const imageIndex = Math.floor(Math.random() * (birb_images.length - 1));
    return message.reply(birb_images[imageIndex].toString());
  }
}

module.exports = { BirbCommand };
