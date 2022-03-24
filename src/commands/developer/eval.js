const { Command, Args } = require('@sapphire/framework');
const { Stopwatch } = require('@sapphire/stopwatch');
const { MessageEmbed, Message } = require('discord.js');
const util = require('util');
const req = require('petitio');
class EvalCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'eval',
            aliases: ['e', 'evaluate', 'ev'],
            description: 'Evaluate code',
            preconditions: ['Developer'],
            flags: ['hide', 'delete', 'del', 'async'],
        });
    }
    /**
     *
     * @param { Message } message
     * @param { Args } args
     * @returns evaluated code
     */
    async messageRun(message, args) {
        let code = await args.restResult('string');
        if (!code.success)
            return message
                .reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(
                                '`code` is a required argument that is missing'
                            )
                            .setColor('RED'),
                    ],
                })
                .then((reply) =>
                    setTimeout(function () {
                        reply.delete();
                        message.delete();
                    }, 3000)
                );
        code = code.value;
        const wantsHide = args.getFlags('hide');
        const wantsDelete = args.getFlags('delete', 'del');
        const async = args.getFlags('async');
        let output, type;
        const evalTime = new Stopwatch();
        let error = false;

        let evaluation = await message.reply('Evaluating...');
        try {
            evalTime.start();
            if (async) code = `(async () => {\n${code}\n})();`;
            output = await eval(code);
            evalTime.stop();
            type = typeof output;
        } catch (err) {
            // return evaluation.edit(`An error occured during evaluation: ${err}`);
            output = `An error occured during evaluation: ${err}`;
            type = `Error`;
            error = true;
        }
        if (typeof output !== 'string')
            output = util.inspect(output, { depth: 0 });
        if (output.length >= 2000) {
            let hastebinOutput = await this.container.utility.createHastebin(
                output
            );
            return evaluation.edit(
                `Output was too long to be sent on discord: ${hastebinOutput}`
            );
        } else if (wantsHide && !error) {
            evaluation.delete();
        } else if (wantsDelete) {
            message.delete();
        }
        if (wantsHide || wantsDelete) return;
        return evaluation.edit(
            `Output: \`\`\`js\n${output}\`\`\`\nType: \`${type}\` Time Taken: \`${evalTime.toString()}\``
        );
    }
}

module.exports = { EvalCommand };
