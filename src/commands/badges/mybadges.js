const { Command } = require("@sapphire/framework");
const { Message } = require("discord.js");

class MyBadgesCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "mybadges",
      aliases: ["mybadge"],
      description: "Shows you your badges",
      preconditions: ["Admin"],
    });
  }

  /**
   *
   * @param { Message } message
   */
  messageRun(message) {
    let badges = message.author.flags.toArray().toString();
    badges = badges.replace("DISCORD_EMPLOYEE", "Discord Staff");
    badges = badges.replace("HOUSE_BRILLIANCE", "Hypesquad Brilliance");
    badges = badges.replace("HOUSE_BALANCE", "Hypesquad Balance");
    badges = badges.replace(
      "EARLY_VERIFIED_BOT_DEVELOPER",
      "Early Verified Bot Developer"
    );
    badges = badges.replace(
      "DISCORD_CERTIFIED_MODERATOR",
      "Discord Certified Moderator"
    );
    const badgesArray = badges.split(",");
    if (!badgesArray.length) return message.reply("You have no badges");
    else
      return message.reply(
        `These are the badges you have: ${badgesArray.toString()}`
      );
  }
}

module.exports = { MyBadgesCommand };
