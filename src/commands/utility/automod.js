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
        this.container.stores
            .get('listeners')
            .get('automodGifPerms').options.enabled = false;
        return message.reply(
            `The gif automod has successfully been disabled. You can use ${this.container.client.options.defaultPrefix}automod enablegif to enable it again`
        );
    }

    /**
     *
     * @param { Message } message
     */
    async enablegif(message) {
        this.container.stores
            .get('listeners')
            .get('automodGifPerms').options.enabled = true;
        return message.reply(
            `The gif automod has successfully been enabled. You can use ${this.container.client.options.defaultPrefix}automod disablegif to disable it again`
        );
    }
}

module.exports = { AutomodCommand };
