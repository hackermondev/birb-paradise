const { Command, Args } = require("@sapphire/framework");
const { isNullOrUndefinedOrEmpty } = require("@sapphire/utilities");
const { Message, MessageEmbed } = require("discord.js");
const { prefix } = require("../../../config.json");
class HelpCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "help",
      aliases: ["cmds"],
      description: "Shows you all the commands on the bot",
      preconditions: [],
    });
  }

  /**
   *
   * @param { Message } message
   * @param { Args } args
   * @returns
   */
  async messageRun(message, args) {
    const commandsData = [];
    let commands = this.container.stores.get("commands");
    const command = await args.pickResult("string");

    if (!command.success) {
      const helpEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Help")
        .setFooter({
          text: `${
            this.container.stores.get("commands").size - 1
          } total commands. Use ${prefix}help [command] to get information on a specific command`,
        });
      let categories = [];
      if (!this.container.client.application.owner)
        await this.container.client.application.fetch();
      for (
        var x = 0;
        x < this.container.stores.get("commands").categories.length;
        x++
      ) {
        categories.push(this.container.stores.get("commands").categories[x]);
      }

      let categoryCommands = new Array(categories.length);
      if (message.author != this.container.client.application.owner)
        commands = commands.filter((c) => c.category != "developer");

      commands.forEach((cmd) => {
        const cmdCategory = cmd.category;
        if (cmdCategory && cmd) {
          if (
            isNullOrUndefinedOrEmpty(
              categoryCommands[categories.indexOf(cmdCategory)]
            )
          ) {
            categoryCommands[categories.indexOf(cmdCategory)] = new Array([
              cmd.name,
            ]);
          } else {
            categoryCommands[categories.indexOf(cmdCategory)].push(cmd.name);
          }
        }
      });

      for (var i = 0; i < categories.length; i++) {
        if (isNullOrUndefinedOrEmpty(categoryCommands[i])) continue;
        helpEmbed.addField(
          `${categories[i].charAt(0).toUpperCase()}${categories[i].slice(1)}`,
          categoryCommands[i].join(", ")
        );
      }
      return message.reply({ embeds: [helpEmbed] });
    }

    let cmd = null;
    if (!this.container.stores.get("commands").get(command.value)) {
      return message.reply(`No help found for command \`${command.value}\``);
    } else {
      cmd = this.container.stores.get("commands").get(command.value);
    }
    commandsData.push(`**Name:** ${cmd.name}\n`);

    if (cmd.aliases.length)
      commandsData.push(` **Aliases:** ${cmd.aliases.join(", ")}\n`);
    if (cmd.description)
      commandsData.push(` **Description:** ${cmd.description}\n`);
    if (cmd.usage) commandsData.push(` **Usage:** ${cmd.usage}\n`);
    if (cmd.preconditions.entries.length)
      commandsData.push(
        `**Permissions:** ${cmd.options.preconditions.join(", ")}\n`
      );
    const commandsDataString = commandsData.join(" ");
    const commandHelpEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle(`Information for ${cmd.name}`)
      .setDescription(`${commandsDataString}`);
    return message.reply({ embeds: [commandHelpEmbed] });
  }
}

module.exports = { HelpCommand };
