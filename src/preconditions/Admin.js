const { Precondition } = require("@sapphire/framework");

class AdminPrecondition extends Precondition {
  run(message) {
    if (message.guild.id === "895515788126072842") return this.ok();
    return message.member.permissions.has("ADMINISTRATOR")
      ? this.ok()
      : this.error("User is not an admin");
  }
}

module.exports = { AdminPrecondition };
