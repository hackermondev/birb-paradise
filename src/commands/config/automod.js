const { Args, Store } = require('@sapphire/framework');
const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { Message, MessageEmbed } = require('discord.js');
const root = `${process.cwd()}/src`;
const validAutomods = ['gif', 'link', 'massMention'];
class AutomodCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'automod',
            aliases: ['autoconfig', 'automodconfig'],
            description: 'Configures or shows you the current automod settings',
            subCommands: [
                'enable',
                'disable',
                { input: 'current', default: true },
            ],
            preconditions: ['Admin'],
        });
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async current(message) {
        const currentAutomodConfig = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Current Automod Configuration');
        for (var i = 0; i < validAutomods.length; ++i) {
            const validAutomod = validAutomods[i];
            const automod = this.container.stores
                .get('listeners')
                .get(`${validAutomod}Automod`);
            currentAutomodConfig.addField(
                `${validAutomod} Automod`,
                automod ? 'Enabled' : 'Disabled',
                true
            );
        }

        return message.reply({ embeds: [currentAutomodConfig] });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async enable(message, args) {
        const rawAutomod = await args.restResult('string');
        if (!rawAutomod.success)
            return this.container.utility.errorReply(
                message,
                'You must provide an automod to enable.'
            );

        if (!validAutomods.some((automod) => rawAutomod.value === automod))
            return this.container.utility.errorReply(
                message,
                `That automod does not exist. The valid automods are ${validAutomods.join(
                    ', '
                )}`
            );

        await this.container.stores
            .get('listeners')
            .load(root, `/listeners/automod/${rawAutomod.value}Automod.js`);

        return message.reply(
            `The ${rawAutomod.value} automod has been enabled.`
        );
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async disable(message, args) {
        const rawAutomod = await args.restResult('string');
        if (!rawAutomod.success)
            return this.container.utility.errorReply(
                message,
                'You must provide an automod to disable.'
            );

        if (!validAutomods.some((automod) => rawAutomod.value === automod))
            return this.container.utility.errorReply(
                message,
                `That automod does not exist. The valid automods are ${validAutomods.join(
                    ', '
                )}`
            );

        await this.container.stores
            .get('listeners')
            .get(`${rawAutomod.value}Automod`)
            .unload();

        return message.reply(
            `The ${rawAutomod.value} automod has been disabled.`
        );
    }
}

module.exports = { AutomodCommand };
