const { Listener, Events } = require('@sapphire/framework');
const { GuildMember, Message } = require('discord.js');
const { staffChatID, mainChannel } = require('../../../config.json');
const joinLimit = 15;
let fastJoins = 0;
let lastJoinDate = Date.now();
let alreadyLocked = false;

class RaidPreventionListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'raidPrevention',
            event: Events.GuildMemberAdd,
        });
    }

    /**
     *
     * @param { GuildMember } member
     */
    async run(member) {
        if (!this.container.utility.isBp(member.guild)) return;
        if (Date.now() - lastJoinDate <= 1000) {
            fastJoins++;
        } else fastJoins = 0;
        if (fastJoins >= joinLimit && !alreadyLocked) {
            const staffChat = member.guild.channels.cache.get(staffChatID);
            if (!staffChat) return;
            let msg = await staffChat.send(
                'A raid has been detected. Inititiating lockdown...'
            );
            msg.content = `>lockdown Automatic Lockdown\n\n Raid Detected\n`;
            member.guild.channels.cache.get(mainChannel).send(`Automatic Lockdown started...`);
            await this.container.stores
                .get('commands')
                .get('lockdown')
                .messageRun(msg);
            member.guild.channels.cache.get(mainChannel).send(`Automatic Lockdown completed`);
            member.guild.setVerificationLevel('VERY_HIGH');
            staffChat.send({
                content: `<@&891322260051329054> <@&891289120406646825> <@&891293531455496202> <@&891439426067107900> <@&891351290125369364> A raid was detected since ${fastJoins} people joined in a very short amount of time, all channels are currently locked down. The verification level has also been set to very high. If this was a false detection you can unlock with the \`>unlockdown\` command`,
                allowedMentions: {
                    users: [],
                    roles: [
                        '891322260051329054',
                        '891289120406646825',
                        '891293531455496202',
                        '891439426067107900',
                        '891351290125369364',
                    ],
                },
            });
            fastJoins = 0;
            return alreadyLocked = true;
        }
        lastJoinDate = Date.now();
    }
}

module.exports = { RaidPreventionListener };
