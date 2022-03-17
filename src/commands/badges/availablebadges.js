const { Command } = require("@sapphire/framework");
const { Message } = require("discord.js");

class AvailableBadgesCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "availablebadges",
      aliases: ["badges"],
      description:
        "Gets you the available badges that you can lookup with the whohasbadge command",
      preconditions: ["Admin"],
    });
  }

  /**
   *
   * @param { Message } message
   */
  messageRun(message) {
    const badgesLiteralStrings = [
      "DISCORD_EMPLOYEE",
      "HOUSE_BRILLIANCE",
      "HOUSE_BALANCE",
      "HOUSE_BRAVERY",
      "EARLY_VERIFIED_BOT_DEVELOPER",
      "DISCORD_CERTIFIED_MODERATOR",
      "HYPESQUAD_EVENTS",
      "EARLY_SUPPORTER",
      "PARTNERED_SERVER_OWNER",
    ];
    const badgesStrings = [
      "discord staff",
      "hypesquad brilliance",
      "hypesquad balance",
      "hypesquad bravery",
      "early verified bot developer",
      "discord certified moderator",
      "hypesquad events",
      "early supporter",
      "partner",
    ];
    return message.reply(
      `The badges that are currently supported are ${badgesLiteralStrings.join(
        ", "
      )}\n You can use them by using the \`${this.container.client.options.defaultPrefix} whohas\` command with the following identifiers: ${badgesStrings.join(
        ", "
      )}`
    );
  }
}

module.exports = { AvailableBadgesCommand };
