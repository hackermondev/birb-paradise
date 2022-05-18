const {
    GuildMember,
    Guild,
    TextChannel,
    Message,
    MessageEmbed,
    WebhookClient,
} = require('discord.js');
const { container } = require('@sapphire/pieces');
const Sentry = require('@sentry/node');
const req = require('petitio');
const {
    staffRoles,
    reactChannels,
    testingServerID,
} = require('../../config.json');
const { isNullOrUndefined } = require('@sapphire/utilities');
class Utility {
    constructor() {}

    /**
     * A function that returns if the member is a staff member
     * @param { GuildMember } member
     * @returns if the member is a staff member
     */
    isStaffMember(member) {
        if (member.permissions.has('ADMINISTRATOR')) return true;
        return staffRoles.some((role) => member.roles.cache.has(role));
    }

    /**
     *
     * @param { Guild } guild
     * @returns if the guild is Birb Paradise
     */
    isBp(guild) {
        return guild.id === '891286303574994974' || guild.id == testingServerID;
    }

    /**
     *
     * @param { TextChannel } channel
     * @returns if the channel is on the react channel list
     */
    isReactChannel(channel) {
        return reactChannels.includes(channel.id);
    }

    /**
     * This function sends an exception to Sentry
     * @param { Sentry.Exception } error
     * @param { String } type
     * @returns the sentry ID of the exception
     */
    sendException(error, type) {
        const sentryID = Sentry.captureException(error);
        console.error(error);
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
        const reply = await message.reply({
            content: errorMsg,
            allowedMentions: { users: [], roles: [], parse: [] },
        });
        if (!reply) return;
        setTimeout(() => {
            message.delete().catch(() => {
                return;
            });
            reply.delete().catch(() => {
                return;
            });
        }, 3500);
        return;
    }

    /**
     *
     * @param { Number } duration
     */
    async delay(duration) {
        return new Promise((r) => setTimeout(r, duration));
    }

    /**
     *
     * @param { String } id
     * @param { String } token
     * @param { MessageEmbed } embed
     */
    async sendWebhook(id, token, embed) {
        const webhookClient = new WebhookClient({
            id: id,
            token: token,
        });
        await webhookClient.send({ embeds: [embed] });
    }

    /**
     * Performs checks for all automod
     * @param { Message } message
     */
    async automodChecks(message) {
        return (
            !isNullOrUndefined(message.guild) &&
            this.isBp(message.guild) &&
            !message.author.bot &&
            !this.isStaffMember(message.member)
        );
    }

    /**
     *
     * @param { String } userID
     */
    async getMessageCount(userID) {
        return container.redis.hget('messages', userID);
    }

    /**
     *
     * @param { String } userID
     * @param { Number } count
     */
    async addMessageCount(userID, count) {
        const currentMemberMsgs = await this.getMessageCount(userID);

        const newMemberMsgs = currentMemberMsgs
            ? Number.parseInt(currentMemberMsgs) + count
            : count;

        await container.redis.hset('messages', userID, newMemberMsgs);
    }
}

module.exports = { Utility };
