const { Precondition } = require('@sapphire/framework');

class DeveloperPrecondition extends Precondition {
	async run(message) {
		if (!this.container.client.application.owner) await this.container.client.application.fetch();
		return message.author.id === client.application.owner.id ? this.ok() : this.error();
	}
}

module.exports = {
  DeveloperPrecondition
};