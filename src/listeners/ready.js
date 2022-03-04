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
    const { username } = client.user;
    this.container.logger.info(`Logged in as ${username}`);
    this.container.client.user.setActivity('development go brr', {type: 'WATCHING'});
  }
}

module.exports = { ReadyListener };