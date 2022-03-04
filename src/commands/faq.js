const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');
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
   * @param { string[] } args 
   * @returns 
   */
  messageRun(message, args) {
    return message.reply('Command not ready');
    // const faqNumber = args.restResult('string');
    // if (!faqNumber.success) return message.reply('You need to enter a rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    // // TODO finish faq command
  }
}

module.exports = { RuleCommand }