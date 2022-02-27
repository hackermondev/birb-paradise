const { Stopwatch } = require('@sapphire/stopwatch');

module.exports = {
	name: 'ping',
	aliases: ['pong'],
	description: 'Check the latency of the bot',
	
	async execute(client, message, args) {
		const stopwatch = new Stopwatch(0).start();

		const reply = await message.reply('Pinging...');
		if (!reply) return;
		stopwatch.stop();
		reply.edit(`Pong! Websocket: \`${client.ws.ping}ms\` Bot Latency: \`${stopwatch}\``)
	},
}