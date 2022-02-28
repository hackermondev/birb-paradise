const { Command } = require('@sapphire/framework');
class EvalCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'eval',
      aliases: ['e','ev'],
      description: 'Evaluate code',
      preconditions: ['Developer']
    });
  }

  async messageRun(message) {
	let code = args.join(' ');
	let includesHide = false;
	if (code.toLowerCase().includes('--hide')) {
		const indexOfHide = code.indexOf('--');
		code = code.slice(0, indexOfHide-1);
		includesHide = true;
	}
	if(!code) return message.reply({embeds: [new MessageEmbed().setDescription('\`code\` is a required argument that is missing').setColor('RED')]}).then(reply => setTimeout( function() { reply.delete(); message.delete()}, 3000));
	let evaluation = await message.reply('Evaluating...')
	try {
		output = await eval(code);
		type = typeof(output);
	}
	catch(err) {
		return evaluation.edit(`An error occured whilst trying to evaluate your code: ${err}`)
	}
	if (typeof output !== 'string') output = util.inspect(output, { depth: 0 });
	if (output.length >= 2000) {
		return evaluation.edit(`Content was too long to be sent: ${(await hastebin.createPaste(output)).toString()}`);
	}
	else if (includesHide) {
		return evaluation.delete();
	}
	return evaluation.edit(`Output: \`\`\`js\n${output}\`\`\`\nType: \`${type}\``);
  }
}

module.exports = {
  EvalCommand
};