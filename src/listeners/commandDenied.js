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
  async run(error, { message }) {
    message.delete();
    this.container.client.logger.debug(
      `error name logging: ${error.name} + error message: ${error.message}`
    );
  }
}

module.exports = { CommandDeniedListener };
