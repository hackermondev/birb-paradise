const { Command, Args } = require("@sapphire/framework");
const { Message } = require("discord.js");

class BanCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "ban",
      aliases: ["b", "yeet"],
      description:
        "Bans a member from the server(doesn't currently log anything",
      preconditions: ["Staff"],
      enabled: false
    });
  }

  /**
   *
   * @param { Message } message
   * @param { Args } args
   * @returns
   */
  async messageRun(message, args) {
    return message.reply("Command isn't ready yet");
    const rawMember = await args.pickResult("string");
    if (!rawMember.success)
      return message.reply("You must provide a member to kick").then((reply) =>
        setTimeout(function () {
          reply.delete();
          message.delete();
        }, 3500)
      );
    const member = await args.pickResult("member");
    if (!member.success)
      return message.reply("Mention a valid user to kick").then((reply) =>
        setTimeout(function () {
          reply.delete();
          message.delete();
        }, 3500)
      );
    await member.value.ban(); // TODO reason and stuff
  }
}

module.exports = { BanCommand };
