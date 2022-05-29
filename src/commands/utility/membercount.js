const { Command } = require('@sapphire/framework');

class MemberCountCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'membercount',
            description: 'Shows you the number of members in this server.',
        });
    }

    async messageRun() {
        return message.reply(
            `There are ${message.guild.memberCount} members in this server.`
        );
    }
}

module.exports = { MemberCountCommand };
