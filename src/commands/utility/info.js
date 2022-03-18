const { Command } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { DurationFormatter } = require('@sapphire/time-utilities');
class InfoCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'info',
            aliases: ['stats'],
            description: 'Gets you information about the bot',
            preconditions: ['Staff'],
        });
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async messageRun(message) {
        const formatter = new DurationFormatter();
        const info = new MessageEmbed()
            .setTitle('Bot Details')
            .setFooter({ text: `${this.container.client.user.tag}` })
            .setColor('RANDOM')
            .addField(
                'Version',
                require(`${process.cwd()}/package.json`).version,
                true
            )
            .addField(
                'Memory Usage',
                `\`${process.memoryUsage.rss() / 1024 / 1024} MiB\``,
                true
            )
            .addField(
                'Users Cached',
                `${this.container.client.users.cache.size}`,
                true
            )
            .addField(
                'Uptime',
                `${formatter.format(this.container.client.uptime)}`,
                true
            )
            .addField(
                'Commands',
                `${this.container.stores.get('commands').size}`,
                true
            )
            .addField('Server', `${message.guild.name}`, true);
        return message.reply({ embeds: [info] });
    }
}

module.exports = { InfoCommand };
