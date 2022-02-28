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
	  // TODO index.js after this make sapphire client
	const { username } = client.user;
	this.container.logger.info(`Logged in as ${username}`);
  }
}

module.exports = {
  ReadyListener
};