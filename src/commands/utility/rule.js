const {
    Command,
    Args,
    UserError,
    ArgumentError,
} = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { rules } = require('../../../config.json');

class RuleCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'rule',
            aliases: ['showrule'],
            preconditions: ['Staff'],
            description: 'Displays a rule',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     * @returns
     */
    async messageRun(message, args) {
        const ruleNumber = parseInt((await args.pickResult('string')).value);
        if (!ruleNumber)
            return this.container.utility.errorReply(
                message,
                'You need to enter a valid rule number'
            );

        if (ruleNumber <= 0 || ruleNumber >= rules.length)
            return this.container.utility.errorReply(
                message,
                "That's not a valid rule number"
            );

        const rule = rules[ruleNumber - 1];
        const ruleEmbed = new MessageEmbed()
            .setTitle(`Rule ${rules.indexOf(rule) + 1}`)
            .setDescription(rule)
            .setColor('YELLOW')
            .setFooter({ text: `${message.guild.name}` });
        return message.reply({ embeds: [ruleEmbed] });
    }
}

module.exports = { RuleCommand };
