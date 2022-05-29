const { Command } = require('@sapphire/framework');
const { Message, MessageEmbed } = require('discord.js');
const { DurationFormatter } = require('@sapphire/time-utilities');
const formatter = new DurationFormatter();
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
        const processMem = process.memoryUsage();

        for (var i = 0; i < packageInfo.developers.length; ++i) {
            await this.container.client.users.fetch(packageInfo.developers[i]);
        }
        const devs = packageInfo.developers.map(
            (id) => this.container.client.users.cache.get(id).tag
        );

        const info = new MessageEmbed()
            .setTitle('Bot Details')
            .setURL('https://statcord.com/bot/925829323762577479')
            .setFooter({ text: `${this.container.client.user.tag}` })
            .setColor('RANDOM')
            .addField('Version', packageInfo.version, true)
            .addField('Developers', devs.join(', '))
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
            );
        return message.reply({ embeds: [info] });
    }
}

module.exports = { InfoCommand };
