const { Command } = require("@sapphire/framework");

// TODO
class MemberCountCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			name: "membercount",
			description: "",
			enabled: false
		});
	}

	async messageRun() {
		return;
	}
}

module.exports = { MemberCountCommand };