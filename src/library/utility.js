const { GuildMember, Guild, TextChannel, Message } = require('discord.js');
const { container } = require('@sapphire/pieces');
const Sentry = require('@sentry/node');
const req = require('petitio');
const { staffRoles, reactChannels } = require('../../config.json');
class Utility {
    constructor() {
        container.utility = this;
    }

    /**
     *
     * @param { GuildMember } member
     * @returns if the member is a staff member
     */
    async isStaffMember(member) {
        if (member.permissions.has('ADMINISTRATOR')) return true;
        return staffRoles.some((role) => member.roles.cache.has(role));
    }

    /**
     *
     * @param { Guild } guild
     * @returns if the guild is Birb Paradise
     */
    async isBp(guild) {
        return guild.id === '891286303574994974';
    }

    /**
     *
     * @param { TextChannel } channel
     * @returns if the channel is on the react channel list
     */
    async isReactChannel(channel) {
        return reactChannels.some((ch) => ch === channel.id);
    }

    /**
     *
     * @param { Sentry.Exception } error
     * @param { String } type
     * @returns the sentry id of the exception
     */
    async sendException(error, type) {
        const sentryID = Sentry.captureException(error);
        container.logger.error(
            `${type} exception with ID ${sentryID} sent to Sentry`
        );
        return sentryID;
    }

    /**
     *
     * @param { String } text
     */
    async createHastebin(text) {
        const res = await req('https://hst.sh/documents', 'POST')
            .body(text)
            .timeout(10000)
            .send();
        if (res.statusCode !== 200) {
            return 'An error occurred while trying to upload the content to hastebin :(';
        }
        return `https://hst.sh/${res.json().key}.js`;
    }

    /**
     *
     * @param { Message } message
     * @param { String } errorMsg the error message
     * @returns whether the error reply was successful
     */
    async errorReply(message, errorMsg) {
        const reply = await message.reply(errorMsg);
        if (!reply) return false;
        setTimeout(() => {
            message.delete().catch(() => {
                return false;
            });
            reply.delete().catch(() => {
                return false;
            });
        }, 3500);
        return true;
    }
}

module.exports = { Utility };
