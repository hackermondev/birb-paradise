const { Precondition } = require('@sapphire/framework');

class DeveloperPrecondition extends Precondition {
    async messageRun(message) {
        if (!this.container.client.application.owner)
            await this.container.client.application.fetch();
        return message.author === this.container.client.application.owner
            ? this.ok()
            : this.error('User is not a developer');
    }
}

module.exports = { DeveloperPrecondition };
