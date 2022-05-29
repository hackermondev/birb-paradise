const { Command, Args, container } = require('@sapphire/framework');
const { MessageButton, Message, MessageActionRow } = require('discord.js');

class EconomyResetCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ecoreset',
            preconditions: ['Admin'],
            description:
                'Resets everyones balance to 0 and removes all shop items.',
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const button = new MessageButton()
            .setCustomId('economy-reset-confirm')
            .setLabel('Confirm')
            .setStyle('DANGER');

        const cancelButton = new MessageButton()
            .setCustomId(`economy-reset-cancel`)
            .setLabel('Cancel')
            .setStyle('SECONDARY');

        const row = new MessageActionRow().addComponents(button, cancelButton);

        const collector = message.channel.createMessageComponentCollector(
            (m) => m.author.id === message.author.id,
            { time: 60000 }
        );
        collector.on('collect', async (m) => {
            if (m.customId == 'economy-reset-confirm') {
                collector.stop();
                await container.economy.ecoDB.reset(message.guild.id);
                await container.economy.shop._connect();
                const a = await container.economy.shop.db.all();
                for (let i = 0; i < a.length; i++) {
                    await container.economy.shop.db.delete(a[i].ID);
                }

                m.reply(
                    `All balances have been reset and shop items deleted from users.`
                );
            } else if (m.customId == 'economy-reset-cancel') {
                collector.stop();
                m.reply(`Reset cancelled.`);
            }
        });

        const m = await message.channel.send({
            content: `Are you sure you want to reset all balances?`,
            components: [row],
        });

        collector.on('end', (_, reason) => {
            if (reason == 'time') {
                m.edit(`Expired`, { components: [] });
            }
        });
    }
}

module.exports = { EconomyResetCommand };
