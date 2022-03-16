const { Command, Args } = require("@sapphire/framework");
const { SubCommandPluginCommand } = require("@sapphire/plugin-subcommands");
const { Message, MessageEmbed } = require("discord.js");
const { prefix } = require("../../../config.json");

class PrefixCommand extends SubCommandPluginCommand {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "prefix",
      aliases: ["currentprefix", "commandprefix"],
      description: "Gets you the prefix of the bot",
      subCommands: ["set", "get"],
      preconditions: ["Staff"],
    });
  }

  /**
   *
   * @param { Message } message
   */
  async get(message) {
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`My current prefix is \`${prefix}\``)
          .setColor("DARK_AQUA"),
      ],
    });
  }

  /**
   *
   * @param { Message } message
   * @param { Args } args
   * @returns
   */
  async set(message, args) {
    const newPrefix = await args.restResult("string");
    if (!newPrefix.success)
      return message
        .reply("You must provide a new prefix to set")
        .then((reply) =>
          setTimeout(function () {
            message.delete();
            reply.delete();
          }, 3500)
        );
    require("../../../config.json").prefix = newPrefix;
    this.container.client.options.defaultPrefix = newPrefix;
    return message.reply(`Prefix successfully set to ${newPrefix}`);
  }
}

module.exports = { PrefixCommand };
