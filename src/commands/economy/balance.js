const { Command, Args, container } = require('@sapphire/framework');
const { CoolEmbeds, Colors } = require('../../library/embeds');
const { coinEmoji } = require('../../../economy.config.json');
const { Message, MessageEmbed } = require('discord.js');

class EconomyBalanceCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'balance',
            aliases: ['bal'],
            description: '(Economy) View your current balance!',
            enabled: true,
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const rawMember = await args.pickResult('member');
        let member = null;
        if (!rawMember.success) {
            member = message.member;
        } else {
            member = rawMember.value;
        }

        const balance = await container.economy.ecoDB.fetchMoney(
            member.id,
            message.guild.id
        );
        const e = new CoolEmbeds(member.user);
        e.setTitle(`User balance`);
        e.setColor(Colors.Success);
        e.setFields([
            {
                name: 'User',
                value: member.toString(),
                inline: true,
            },

            {
                name: 'Balance',
                value: `${balance} ${coinEmoji}`,
                inline: true,
            },
        ]);

        const multiplier = await container.economy.getUserMultiplier(
            member.id,
            message.guild.id
        );
        if (multiplier > 1) {
            e.setFooter(`This user has a x${multiplier} multiplier!`);
        }

        // e.fields([
        //     [ 'User', member, true],
        //     [ 'Balance', `${balance}`, true],
        //     // TODO find a way to find rank of user? i think there used to be a way to do this
        //     // ['Position', '', true]
        // ]);

        return message.reply({
            embeds: [e],
        });
    }
}

module.exports = { EconomyBalanceCommand };
