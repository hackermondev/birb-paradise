const { Listener, Events } = require("@sapphire/framework");
const { Message, MessageEmbed, WebhookClient } = require("discord.js");
const {
  msgLogWebhookID,
  msgLogWebhookToken,
  bpGuildID,
} = require("../../config.json");

class MessageDeleteLogging extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: false,
      event: Events.MessageDelete,
    });
  }

  /**
   *
   * @param { Message } message
   */
  async run(message) {
    if (message.guildId !== bpGuildID) return;
    if (message.channel.parentId === "891307974948184114") return;
    if (!message.content) return; // TODO add support for image logging and other types of messages
    const webhookClient = new WebhookClient({
      id: msgLogWebhookID,
      token: msgLogWebhookToken,
    });
    const msgDeleteEmbed = new MessageEmbed()
      .setTitle(`Message deleted by ${message.author.tag}`)
      .addField("Message", `${message.content}`)
      .addField("User", `<@${message.author.id}>`, true)
      .addField("Channel", `<#${message.channel.id}>`, true)
      .addField("Time", `<t:${Math.round(Date.now() / 1000)}>`, true)
      .setColor("DARK_ORANGE");
    webhookClient.send({
      embeds: [msgDeleteEmbed],
    });
  }
}

module.exports = { MessageDeleteLogging };
