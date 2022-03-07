const { Listener } = require("@sapphire/framework");
const { Client } = require("discord.js");
const { container } = require("@sapphire/framework");

class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: "ready",
    });
  }

  /**
   *
   * @param { Client } client
   */
  run(client) {
    this.container.logger.info(`Logged in as ${client.user.tag}!`);
    this.container.client.user.setActivity("development go brr", {
      type: "WATCHING",
    });
    this.container.logger.info(`Pinging...`);
    this.container.logger.info(
      `Ping acknowledged by the API. Bot is verified to be online.\n\n`
    );
    setInterval(function () {
      container.logger.info(`Pinging...`);
      const wsPing = client.ws.ping;
      container.logger.info(
        `Ping acknowledged by the API. Latency is ${wsPing} ms.\n\n`
      );
    }, 300000);
  }
}

module.exports = { ReadyListener };
