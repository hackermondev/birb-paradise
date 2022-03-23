const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { faqs } = require('../../../config.json');

class FaqCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'faq',
            aliases: ['showfaq'],
            preconditions: ['Staff'],
            description: 'Displays a faq',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     * @returns
     */
    async messageRun(message, args) {
        let faqNumber = await args.pickResult('string');
        if (!faqNumber.success)
            return this.container.utility.errorReply(
                message,
                'You need to enter a rule number'
            );
        message.channel.send(
            "This command isn't ready yet, but you can still use it. However, it may not work as intended"
        );
        faqNumber = faqNumber.value;
        if (Number.isNaN(Number.parseInt(faqNumber)))
            return this.container.utility.errorReply(
                message,
                `That's not a valid number`
            );
        if (faqNumber < 0 || faqNumber >= rules.length)
            return this.container.utility.errorReply(
                message,
                `That's not a valid rule number`
            );
        faqNumber = Number.parseInt(faqNumber);
        const faq = faqs[faqNumber - 1];
        const faqEmbed = new MessageEmbed()
            .setTitle(`Faq ${rules.indexOf(faq) + 1}`)
            .setDescription(faq)
            .setColor('YELLOW')
            .setFooter({ text: `${message.guild.name}` });
        return message.reply({ embeds: [faqEmbed] });
    }
}

module.exports = { FaqCommand };
