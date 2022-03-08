const { SapphireClient } = require("@sapphire/framework");
require("@sapphire/plugin-logger/register");
const { prefix } = require("../config.json");
const { DISCORD_TOKEN } = require("../config.json");

process.on("uncaughtException", (error) => {
  client.logger.error(error);
});

process.on("exit", (code) => {
  client.logger.warn(`Process exiting with code ${code}...`);
});

const client = new SapphireClient({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS"],
});
client.options.defaultPrefix = prefix;

client.login(DISCORD_TOKEN);
