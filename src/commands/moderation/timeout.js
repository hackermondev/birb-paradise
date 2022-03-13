const { Command, Args } = require("@sapphire/framework");
const { Message, MessageEmbed } = require("discord.js");
const { Duration } = require("@sapphire/time-utilities");
const { DurationFormatter } = require("@sapphire/time-utilities");

class TimeoutCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "timeout",
      preconditions: ["Staff"],
      description: "Times out someone in the server",
    });
  }

  /**
   *
   * @param { Message } message
   * @param { Args } args
   */
  async messageRun(message, args) {
    const rawArgs = await args.restResult("string");
    if (!rawArgs.success)
      return message.reply("Mention someone to timeout").then((reply) =>
        setTimeout(function () {
          message.delete();
          reply.delete();
        }, 3500)
      );
    const actionMember = await args.pickResult("member");
    const rawActionTime = await args.pickResult("string");
    const reason = await args.pickResult("string");
    if (!actionMember.success)
      return message.reply("Mention a valid user to timeout").then((reply) =>
        setTimeout(function () {
          message.delete();
          reply.delete();
        }, 3500)
      );
    if (!rawActionTime.success)
      return message
        .reply("Specify a time to timeout the user for")
        .then((reply) =>
          setTimeout(function () {
            message.delete();
            reply.delete();
          }, 3500)
        );
    if (!reason.success)
      return message
        .reply("You must provide a reason to timeout")
        .then((reply) =>
          setTimeout(function () {
            message.delete();
            reply.delete();
          }, 3500)
        );
    const time = new Duration(rawActionTime.value).offset;
    const d = new DurationFormatter();
    try {
      await actionMember.value.timeout(time, reason.value);
      return message.reply(
        `<@${
          actionMember.value.id
        }> has been successfully timeouted for ${d.format(time)}`
      );
    } catch (error) {
      return message.reply(`Failed to timeout <@${actionMember.value.id}>`);
    }
  }
}

module.exports = { TimeoutCommand };
