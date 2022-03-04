const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { faqs } = require('../../config.json');

class FaqCommand extends Command {
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
    // return message.reply('Command not ready');
    let faqNumber = args.restResult('string');
    message.channel.send('This command isn\'t ready yet, but you can still use it. However, it may not work as expected');
    if (!faqNumber.success) return message.reply('You need to enter a rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    else if (Number.isNaN(Number.parseInt(ruleNumber))) return message.reply('That\'s not a valid number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    else if (ruleNumber < 0 || ruleNumber >= rules.length) return message.reply('That\'s not a valid rule number').then(reply => setTimeout(function() { message.delete(); reply.delete();}, 3500));
    faqNumber = Number.parseInt(ruleNumber);
    const faq = faqs[faqNumber];
    const faqEmbed = new MessageEmbed()
      .setTitle(`Rule ${rules.indexOf(faq)}`)
      .setDescription(faq)
      .setFooter({text: `${message.guild.name}`})
    return message.reply({embeds: [faqEmbed]});
  }
}

module.exports = { FaqCommand }