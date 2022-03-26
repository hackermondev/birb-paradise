const { Command, Args } = require('@sapphire/framework');
const { Message } = require('discord.js');

class RaidBanCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'raidban',
            aliases: ['rban'],
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
        const users = await args.restResult('string');
        if (!users.success)
            return this.container.utility.errorReply(
                message,
                'You must provide users to ban for raiding'
            );
        const usersArray = users.value.split(' ');
        const isAdmin = this.container.stores
            .get('preconditions')
            .get('Admin')
            .messageRun(message).success
            ? true
            : false;
        if (!isAdmin && usersArray.length > 10)
            return this.container.utility.errorReply(
                message,
                'You can only ban up to 10 users at a time'
            );
        message.reply(`Banning ${usersArray.length} users`);
        let errors = [];
        for (let x = 0; x < usersArray.length; ++x) {
            const user = usersArray[x];
            const resolvedUser = await this.container.client.users
                .fetch(user)
                .catch(() => null);
            if (!resolvedUser) {
                errors.push(`${user} is not a valid user`);
                continue;
            }
            if (
                this.container.utility.isStaffMember(
                    message.guild.members.cache.get(user)
                )
            ) {
                errors.push(`${user} is a staff member`);
                continue;
            }
            await message.guild.members
                .ban(resolvedUser, {
                    days: 7,
                    reason: `Raiding or attempting to raid ${message.guild.name}`,
                })
                .catch((e) => errors.push(`Error banning ${user}: ${e}`));
            await this.container.utility.delay(400);
        }

        if (!errors.length)
            return message.channel.send(
                `Successfully banned ${
                    usersArray.length - 1
                } users from this server for raiding`
            );
        else {
            return message.channel.send(
                `Successfully banned ${
                    errors.length - usersArray.length
                } users from this server. There were errors banning some users:\n  \`\`\`js\n${errors.toString()} \`\`\``
            );
        }
    }
}

module.exports = { RaidBanCommand };
