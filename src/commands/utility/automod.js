const { Args } = require('@sapphire/framework');
const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { Message } = require('discord.js');

class AutomodCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'automod',
            aliases: ['auto'],
            description: 'Configures or shows you the current automod settings',
            subCommands: ['current', 'disablegif', 'enablegif'],
            preconditions: ['Admin'],
        });
    }

    /**
     *
     * @param { Message } messsage
     * @returns
     */
    async current(message) {
        return message.reply('Subcommand not ready');
    }

    /**
     *
     * @param { Message } message
     */
    async disablegif(message) {
        if (
            !this.container.stores.get('listeners').get('automodGifPerms')
                .enabled
        )
            return message.reply(
                `The gif automod is already disabled. Use \`${this.container.client.options.defaultPrefix}automod enablegif\` to enable it`
            );
        this.container.stores
            .get('listeners')
            .get('automodGifPerms').enabled = false;
        return message.reply(
            `The gif automod has successfully been disabled. You can use \`${this.container.client.options.defaultPrefix}automod enablegif\` to enable it again`
        );
    }

    /**
     *
     * @param { Message } message
     */
    async enablegif(message) {
        if (
            this.container.stores.get('listeners').get('automodGifPerms').enabled
        )
            return message.reply(
                `The gif automod is already enabled. Use \`${this.container.client.options.defaultPrefix}automod disablegif\` to disable it`
            );
        this.container.stores
            .get('listeners')
            .get('automodGifPerms').enabled = true;
        return message.reply(
            `The gif automod has successfully been enabled. You can use \`${this.container.client.options.defaultPrefix}automod disablegif\` to disable it again`
        );
    }
}

module.exports = { AutomodCommand };
