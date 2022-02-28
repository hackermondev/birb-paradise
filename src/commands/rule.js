const { Command } = require('@sapphire/framework');

class RuleCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'rule',
      aliases: ['showrule'],
      preconditions: ['Staff'],
      description: 'Displays a rule'
    });
  }
  
  messageRun(message, args) {
	const ruleNumber = args.restResult('string');
	if (!ruleNumber.success) return message.reply('You need to enter a rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
	// TODO finish rule command
  }
}