const fs = require("fs");
require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { CommandInteraction, Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`✅ Command: ${command.data.name} has been registered`);
      }
    }

    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;
    const rest = new REST({ version: "10" }).setToken(process.env.DEV_TOKEN);

    try {
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });
      /*
      await rest.put(Routes.applicationCommands(clientId), {
       body: client.commandArray,
      });
      */

      console.log(`✅ Successfully reloaded all application (/) commands!`);
    } catch (error) {
      console.error(error);
    }
  };
};
