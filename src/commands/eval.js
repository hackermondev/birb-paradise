const { Command, Args } = require('@sapphire/framework');
const { MessageEmbed, Message } = require('discord.js');
const util = require('util');
class EvalCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'eval',
      aliases: ['e'],
      description: 'Evaluate code',
      preconditions: ['Developer'],
      flags: ['hide','delete','del']
    });
  }
  /**
   * 
   * @param { Message } message 
   * @param { Args } args 
   * @returns evaluated code
   */
  async messageRun(message, args) {
	let code = await args.restResult('string');
	if(!code.success) return message.reply({embeds: [new MessageEmbed().setDescription('\`code\` is a required argument that is missing').setColor('RED')]}).then(reply => setTimeout( function() { reply.delete(); message.delete()}, 3000));
	code = code.value;
	const wantsHide = args.getFlags('hide');
	const wantsDelete = args.getFlags('delete', 'del');
	let output, type;
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
		return evaluation.edit(`Content was too long to be sent`);
	}
	else if (wantsHide) {
		return evaluation.delete();
	}
	else if (wantsDelete) {
		evaluation.delete();
		return message.delete();
	}
	return evaluation.edit(`Output: \`\`\`js\n${output}\`\`\`\nType: \`${type}\``);
  }
}

module.exports = {
  EvalCommand
};