const { Listener } = require('@sapphire/framework');
const { Client } = require('discord.js');

class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: 'ready'
    });
  }

  /**
   * 
   * @param { Client } client 
   */
  run(client) {
    this.container.logger.info(`Logged in as ${client.user.tag}!`);
    this.container.client.user.setActivity('development go brr', {type: 'WATCHING'});
    setInterval(function() { 
      console.log(`Pinging...`);
      const wsPing = client.ws.ping;
      console.log(`Ping acknowledged by the api. Latency is ${wsPing} ms`);
    }, 10000);
  }
}

module.exports = { ReadyListener };