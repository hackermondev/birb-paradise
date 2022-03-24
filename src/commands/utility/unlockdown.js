const { Command, Args } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { lockdownChannels, mainChannel } = require('../../../config.json');

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
        if (!unlockMsg.success) return this.container.utility.errorReply(message, 'Provide a reason to unlock the server');
        message.channel.send('Starting Unlockdown...');
        for (var i = 0; i < lockdownChannels.length; ++i) {
            const ch = message.guild.channels.cache.get(lockdownChannels[i]);
            await ch.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: null,
            });
            await ch.send(`This channel is now unlocked.`);
            await this.container.utility.delay(400);
        }

        const serverUnlockEmbed = new MessageEmbed()
            .setTitle('Server Unlocked')
            .setDescription(unlockMsg.value)
            .setFooter({ text: `${message.guild.name}` });
        message.guild.channels.cache
            .get(mainChannel)
            .send({ embeds: [serverUnlockEmbed] });
        message.channel.send('The server has been unlocked.');
    }
}

module.exports = { UnLockdownCommand };
