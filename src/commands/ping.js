const { Command } = require('@sapphire/framework');
const { Stopwatch } = require('@sapphire/stopwatch');
class PingCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'ping',
      aliases: ['pong'],
      description: 'Gets you the latency of the bot'
    });
  }

  async messageRun(message) {
	const stopwatch = new Stopwatch(0).start();

	const reply = await message.reply('Pinging...');
	if (!reply) return;
	stopwatch.stop();
	return reply.edit(`Pong! Websocket: \`${this.container.client.ws.ping}ms\` Bot Latency: \`${stopwatch}\``)
  }
}

module.exports = {
  PingCommand
};