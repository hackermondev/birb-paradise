const { Command, Args, UserError } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { rules } = require('../../config.json');

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
  
  /**
   * 
   * @param { Message } message 
   * @param { Args } args 
   * @returns 
   */
  messageRun(message, args) {
  return message.reply('Command not ready');
	// const ruleNumber = args.restResult('string');
	// if (!ruleNumber.success) return message.reply('You need to enter a rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
	// // TODO finish rule command
  // return message.reply('Command not ready');
  }
}

module.exports = { RuleCommand }