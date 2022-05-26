const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class RaidMassbanCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'raidmassban',
            aliases: ['rban', 'raidban'],
            description: 'Bans users from the server for raiding',
            usage: `[user ids]`,
            preconditions: ['Staff'],
        });
    }

    /**
     *
     * @param { Message } message
     * @param { Args } args
     */
    async messageRun(message, args) {
        if (!this.container.utility.isBp(message.guild))
            return this.container.utility.errorReply(
                message,
                'This command is currently only available to Birb Paradise'
            );
        const users = await args.repeatResult('user');
        if (!users.success)
            return this.container.utility.errorReply(
                message,
                'You must provide valid users to ban for raiding'
            );
        const isAdmin = (
            await this.container.stores
                .get('preconditions')
                .get('Admin')
                .messageRun(message)
        ).success;

        if (!isAdmin && users.value.length > 20)
            return this.container.utility.errorReply(
                message,
                'You can only ban up to 20 users at a time.'
            );
        message.reply(`Banning ${users.value.length} users...`);

        let errors = [];
        for (let x = 0; x < users.value.length; ++x) {
            const user = users.value[x];
            if (
                this.container.utility.isStaffMember(
                    message.guild.members.cache.get(user.id)
                )
            ) {
                errors.push(
                    `${user} is a staff member, so you cannot ban them.`
                );
                continue;
            }
            await message.guild.members
                .ban(user, {
                    days: 7,
                    reason: `Raiding or attempting to raid ${message.guild.name}.`,
                })
                .catch((e) => errors.push(`Error banning ${user} (${user.id}): ${e}`));
            await this.container.utility.delay(400);
        }

        if (!errors.length)
            return message.channel.send(
                `Successfully banned ${
                    users.value.length - 1
                } users from this server for raiding`
            );
        else {
            return message.channel.send({
                content: `Successfully banned ${
                    errors.length - usersArray.length
                } users from this server. There were errors banning some users:\n  \`\`\`js\n${errors.join(
                    '\n'
                )} \`\`\``,
                allowedMentions: { users: [], roles: [], parse: [] },
            });
        }
    }
}

module.exports = { RaidMassbanCommand };
