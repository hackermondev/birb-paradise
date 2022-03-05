const { Command, Args, UserError } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
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
  async messageRun(message, args) {
    let ruleNumber = await args.pickResult('string');
    if (!ruleNumber.success) return message.reply('You need to enter a rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    ruleNumber = ruleNumber.value;
    if (Number.isNaN(Number.parseInt(ruleNumber))) return message.reply('That\'s not a valid number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    if (ruleNumber < 0 || ruleNumber >= rules.length) return message.reply('That\'s not a valid rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    ruleNumber = Number.parseInt(ruleNumber);
    const rule = rules[ruleNumber - 1];
    const ruleEmbed = new MessageEmbed()
      .setTitle(`Rule ${rules.indexOf(rule)}`)
      .setDescription(rule)
      .setColor('YELLOW')
      .setFooter({text: `${message.guild.name}`})
    return message.reply({embeds: [ruleEmbed]});
  }
}

module.exports = { RuleCommand }