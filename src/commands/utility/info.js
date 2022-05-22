const { Command } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { DurationFormatter } = require('@sapphire/time-utilities');
const packageInfo = require(`${process.cwd()}/package.json`);
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
        const processMem = process.memoryUsage();

        const devs = packageInfo.developers.map((dev) => (this.container.client.users.fetch(dev).then((user) => user.tag).catch(() => null)));
        const info = new MessageEmbed()
            .setTitle('Bot Details')
            .setFooter({ text: `${this.container.client.user.tag}` })
            .setColor('RANDOM')
            .addField(
                'Version',
                packageInfo.version,
                true
            )
            .addField(
                'Developers',
                devs.join(', '),
            )
            .addField(
                'Memory Usage(RSS)',
                `\`${(processMem.rss / 1024 / 1024).toFixed(3)} MiB\``,
                true
            )
            .addField(
                'Memory Usage(Heap)',
                `\`${(processMem.heapUsed / 1024 / 1024).toFixed(3)} MiB\``,
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
        return message.reply({ embeds: [info] });
    }
}

module.exports = { InfoCommand };
