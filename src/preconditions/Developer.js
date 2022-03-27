const { Precondition } = require('@sapphire/framework');
const { Message } = require('discord.js');

class DeveloperPrecondition extends Precondition {
    /**
     * 
     * @param { Message } message 
     * @returns 
     */
    async messageRun(message) {
        if (!this.container.client.application.owner)
            await this.container.client.application.fetch();
        return message.author.id === this.container.client.application.owner.id
            ? this.ok()
            : this.error('User is not a developer');
    }
}

module.exports = { DeveloperPrecondition };
