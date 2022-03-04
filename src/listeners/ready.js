const { Listener } = require('@sapphire/framework');

class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: 'ready'
    });
  }

  run(client) {
    const { username } = client.user;
    this.container.logger.info(`Logged in as ${username}`);
    this.container.client.user.setActivity('development go brr', {type: 'WATCHING'});
  }
}

module.exports = { ReadyListener };