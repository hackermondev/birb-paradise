const { Command } = require('@sapphire/framework');
const { faqs } = require('../../config.json');

class RuleCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: 'faq',
      aliases: ['showfaq'],
      preconditions: ['Staff'],
      description: 'Displays a faq'
    });
  }
  
  /**
   * 
   * @param { Message } message 
   * @param {*} args 
   * @returns 
   */
  messageRun(message, args) {
	const faqNumber = args.restResult('string');
	if (!faqNumber.success) return message.reply('You need to enter a rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
	// TODO finish faq command
  }
}

module.exports = {
	RuleCommand
}