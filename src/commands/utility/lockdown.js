const { Command } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { lockdownChannels, mainChannel } = require('../../../config.json');

class LockdownCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'lockdown',
            aliases: ['lockall'],
            description: 'Locks down Birb Paradise',
            preconditions: ['Staff'],
            enabled: false,
        });
    }

    /**
     *
     * @param { Message } message
     */
    async messageRun(message) {
        if (!this.container.utility.isBp(message.guild))
            return message.reply('This server is not configured');
        message.channel.send('Starting Lockdown...');
        for (var i = 0; i < lockdownChannels.length; ++i) {
            const ch = message.guild.channels.cache.get(lockdownChannels[i]);
            await ch.permissionOverwrites.edit(message.guild.roles.everyone, {
                SEND_MESSAGES: false,
            });
            await ch.send(
                `This channel is locked. see <#${mainChannel}> for more information.`
            );
        }
        // TODO handle ratelimits
        const serverLockEmbed = new MessageEmbed()
            .setTitle('Server Lockdown')
            .setFooter({ text: `${message.guild.name}` });
        message.guild.channels.cache
            .get(mainChannel)
            .send({ embeds: [serverLockEmbed] });
        message.channel.send('The server has been locked down.');
    }
}

module.exports = { LockdownCommand };
