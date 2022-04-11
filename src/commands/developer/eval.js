const { Command, Args } = require('@sapphire/framework');
const { Stopwatch } = require('@sapphire/stopwatch');
const { MessageEmbed, Message } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');
const util = require('util');
class EvalCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'eval',
            aliases: ['e', 'evaluate', 'ev'],
            description: 'Evaluate code',
            preconditions: ['Developer'],
            flags: ['hide', 'delete', 'del', 'async', 'showh', 'showp', 'notcompact', 'sorted'],
            options: ['depth', 'breaklength', 'maxarraylength', 'maxstringlength'],
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
        let output, type;
        const evalTime = new Stopwatch();
        let error = false;

        let evaluation = await message.reply('Evaluating...');
        try {
            if (args.getFlags('async')) code = `(async () => {\n${code}\n})();`;
            evalTime.start();
            output = await eval(code);
            evalTime.stop();
            type = typeof output;
        } catch (err) {
            // return evaluation.edit(`An error occured during evaluation: ${err}`);
            output = `An error occured during evaluation: ${err}`;
            type = typeof err;
            error = true;
        }
        if (typeof output !== 'string')
            output = util.inspect(output, {
                depth: args.getOption('depth') || 2,
                showHidden: args.getFlags('showh'),
                showProxy: args.getFlags('showp'),
                compact: !args.getFlags('notcompact'),
                sorted: args.getFlags('sorted'),
                breakLength: args.getFlags('breakLength') || 80,
                maxArrayLength: args.getOption('maxarraylength') || 100,
                maxStringLength: args.getOption('maxstringlength') || 10000,
            });
        if (output.length >= 2000) {
            let hastebinOutput = await this.container.utility.createHastebin(
                output
            );
            return evaluation.edit(
                `Output was too long to be sent on discord: ${hastebinOutput}`
            );
        } else if (args.getFlags('hide') && !error) {
            evaluation.delete();
        } else if (args.getFlags('delete', 'del')) {
            message.delete();
        }
        if (args.getFlags('hide') || args.getFlags('delete', 'del')) return;
        return evaluation.edit(
            `Output: ${codeBlock('js', output)} \nType: \`${type}\` Time Taken: \`${evalTime}\``
        );
    }
}

module.exports = { EvalCommand };
