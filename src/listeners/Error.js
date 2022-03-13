const { Listener } = require("@sapphire/framework");

class ErrorListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "error",
      once: false,
      event: "Error",
    });
  }
  /**
   *
   * @param { Error } error
   * @param { String } message
   */
  async run(error, message) {
   this.container.logger.debug(`error name(error listener): ${error.name} + message: ${error.message}`);
  }
}

module.exports = { ErrorListener };
