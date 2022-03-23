const { Args } = require('@sapphire/framework');
const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { Message, MessageEmbed } = require('discord.js');

class AutomodCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'automod',
            aliases: ['auto'],
            description: 'Configures or shows you the current automod settings',
            subCommands: [
                'current',
                'disablegif',
                'enablegif',
                'disableaccountkick',
                'enableaccountkick',
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
        const automods = this.container.stores
            .get('listeners')
            .filter((cmd) => cmd.name.endsWith('Automod'));
        const currentAutomodConfig = new MessageEmbed().setTitle(
            'Current Automod Configuration'
        );
        automods.forEach((automod) => {
            currentAutomodConfig.addField(
                'Gifs',
                this.container.stores.get('listeners').get(automod.name).enabled
                    ? `enabled`
                    : `disabled`
            );
        });
        currentAutomodConfig.addField(
            'Account Age Kick',
            this.container.stores
                .get('listeners')
                .get('guildMemberAddAccountAgeKick').enabled
                ? 'enabled'
                : 'disabled'
        );
        return message.reply({ embeds: [currentAutomodConfig] });
    }

    /**
     *
     * @param { Message } message
     */
    async disablegif(message) {
        if (!this.container.stores.get('listeners').get('gifAutomod').enabled)
            return message.reply(
                `The gif automod is already disabled. Use \`${this.container.client.options.defaultPrefix}automod enablegif\` to enable it`
            );
        await this.container.stores.get('listeners').get('gifAutomod').unload();
        return message.reply(
            `The gif automod has successfully been disabled. You can use \`${this.container.client.options.defaultPrefix}automod enablegif\` to enable it again`
        );
    }

    /**
     *
     * @param { Message } message
     */
    async enablegif(message) {
        if (this.container.stores.get('listeners').get('gifAutomod').enabled)
            return message.reply(
                `The gif automod is already enabled. Use \`${this.container.client.options.defaultPrefix}automod disablegif\` to disable it`
            );
        await this.container.stores.get('listeners').get('gifAutomod').reload();
        return message.reply(
            `The gif automod has successfully been enabled. You can use \`${this.container.client.options.defaultPrefix}automod disablegif\` to disable it again`
        );
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async enableaccountkick(message) {
        if (
            this.container.stores
                .get('listeners')
                .get('guildMemberAddAccountAgeKick').enabled
        )
            return message.reply(
                `The gif automod is already enabled. Use \`${this.container.client.options.defaultPrefix}automod disableaccountkick\` to disable it`
            );
        await this.container.stores
            .get('listeners')
            .get('gifguildMemberAddAccountAgeKickAutomod')
            .reload();
        return message.reply(
            `The gif automod has successfully been enabled. You can use \`${this.container.client.options.defaultPrefix}automod disableaccountkick\` to disable it again`
        );
    }

    /**
     *
     * @param { Message } message
     * @returns
     */
    async disableaccountkick(message) {
        if (
            !this.container.stores
                .get('listeners')
                .get('guildMemberAddAccountAgeKick').enabled
        )
            return message.reply(
                `The gif automod is already disabled. Use \`${this.container.client.options.defaultPrefix}automod disableaccountkick\` to enable it`
            );
        await this.container.stores
            .get('listeners')
            .get('gifguildMemberAddAccountAgeKickAutomod')
            .unload();
        return message.reply(
            `The gif automod has successfully been disabled. You can use \`${this.container.client.options.defaultPrefix}automod disableaccountkick\` to enable it again`
        );
    }
}

module.exports = { AutomodCommand };
