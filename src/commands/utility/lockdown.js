const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { lockdownChannels, mainChannel } = require('../../../config.json');
const { Stopwatch } = require('@sapphire/stopwatch');

class LockdownCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'lockdown',
            aliases: ['lockall'],
            description: 'Locks down Birb Paradise',
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
        const lockMsg = await args.restResult('string');
        if (!lockMsg.success)
            return this.container.utility.errorReply(
                message,
                'Provide a reason to lock the server'
            );
        message.channel.send('Starting Lockdown...');
        const lockTime = new Stopwatch().start();
        for (var i = 0; i < lockdownChannels.length; ++i) {
            const ch = message.guild.channels.cache.get(lockdownChannels[i]);
            await ch.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: false,
            });
            await ch.permissionOverwrites.edit('925832521218920490', {
                SEND_MESSAGES: true,
            });
            if (ch.id === mainChannel) continue;
            await ch.send(
                `This channel is locked. see <#${mainChannel}> for more information.`
            );
            await this.container.utility.delay(150);
        }
        await message.guild.channels.cache
            .get('893914976568373258')
            .permissionOverwrites.edit(message.guild.roles.everyone, {
                VIEW_CHANNEL: false,
            });
        lockTime.stop();
        const serverLockEmbed = new MessageEmbed()
            .setTitle('Server Locked')
            .setDescription(
                `The server has been locked by a staff member\n\n Reason:\n ${lockMsg.value}`
            )
            .setColor('RED')
            .setFooter({ text: `${message.guild.name}` });
        message.guild.channels.cache
            .get(mainChannel)
            .send({ embeds: [serverLockEmbed] });
        return message.channel.send(
            `The server has been locked down. Process took ${lockTime}`
        );
    }
}

module.exports = { LockdownCommand };
