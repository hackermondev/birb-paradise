const { Command, Args } = require('@sapphire/framework');
const { Message, MessageActionRow, MessageButton } = require('discord.js');

class ResetMessagesCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'resetmessages',
            description: 'Resets the message count for a member.',
            preconditions: ['Admin'],
            aliases: [
                'resetmessagecount',
                'resetmessagecounts',
                'resetmsgcount',
                'resetmsgs',
            ],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        const user = await args.pickResult('user');
        if (!user.success)
            return this.container.utility.errorReply(
                message,
                'You must provide a valid user to reset the messages of'
            );
        if (user.value.bot)
            return this.container.utility.errorReply(
                message,
                'You cannot reset the messages of a bot'
            );
        const rawID = user.value.id;

        const redisEntry = await this.container.leaderboard.getAllTimeMessageCount(
            rawID
        );
        if (!redisEntry)
            return this.container.utility.errorReply(
                message,
                `<@${rawID}> does not have a message count stored to reset.`
            );

        const msg = await message.reply({
            content: `Are you sure you want to reset the messages of ${user.value} (${user.value.tag})`,
            allowedMentions: { users: [], roles: [], parse: [] },
        });
        const c = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`resetMessagesYes-${user.value.id}`)
                .setLabel('Yes')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId(`resetMessagesNo-${user.value.id}`)
                .setLabel('No')
                .setStyle('DANGER')
        );
        return msg.edit({ components: [c] });
    }
}

module.exports = { ResetMessagesCommand };
