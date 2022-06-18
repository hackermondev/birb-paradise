const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const {
    lockdownIgnoredCategories,
    lockdownIgnoredChannels,
    mainChannel,
} = require('../../../config.json');
const { Stopwatch } = require('@sapphire/stopwatch');

class UnLockdownCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'unlockdown',
            aliases: ['unlockall'],
            description: 'Unlocks Birb Paradise',
            preconditions: ['Staff'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        if (!this.container.utility.isBp(message.guild))
            return message.reply('This server is not setup');
        const unlockMsg = await args.restResult('string');
        if (!unlockMsg.success)
            return this.container.utility.errorReply(
                message,
                'Provide a reason to unlock the server'
            );
        message.channel.send('Starting Unlockdown...');
        const unlockTime = new Stopwatch().start();
        const channels = [...message.guild.channels.cache.values()];
        let errors = [];
        for (var x = 0; x < channels.length; ++x) {
            const ch = channels[x];
            if (!ch || ch.type !== 'GUILD_TEXT') continue;
            if (
                lockdownIgnoredCategories.includes(ch.parentId) ||
                lockdownIgnoredChannels.includes(ch.id)
            )
                continue;
            await ch.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: null,
            });

            if (ch.id === mainChannel) continue;
            await ch.send(
                `This channel is locked. see <#${mainChannel}> for more information.`
            );
            await this.container.utility.delay(100);
        }
        await message.guild.channels.cache
            .get('893914976568373258')
            .permissionOverwrites.edit(message.guild.roles.everyone, {
                VIEW_CHANNEL: null,
            });
        unlockTime.stop();
        const serverUnlockEmbed = new MessageEmbed()
            .setTitle('Server Unlocked')
            .setDescription(
                `The server has been unlocked by a staff member\n\n Reason:\n ${unlockMsg.value}`
            )
            .setColor('GREEN')
            .setFooter({ text: `${message.guild.name}` });
        message.guild.channels.cache
            .get(mainChannel)
            .send({ embeds: [serverUnlockEmbed] });
        message.channel.send(
            `The server has been unlocked. Process took ${unlockTime} ${
                errors.length ? `\n${errors.join('\n')}` : ''
            }`
        );
    }
}

module.exports = { UnLockdownCommand };
