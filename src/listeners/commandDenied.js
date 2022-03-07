const { Listener } = require("@sapphire/framework");

class CommandDeniedListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "commandDenied",
      once: false,
      event: "commandDenied",
    });
  }
  /**
   *
   * @param { Error } error
   * @param { String } message
   */
  run(error, { message }) {
    message.delete();
    console.log(`error name logging: ${error.name}`);
  }
}

module.exports = { CommandDeniedListener };
