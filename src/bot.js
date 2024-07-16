const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.commands = new Collection();
client.color = "";
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    const filePath = `./functions/${folder}/${file}`;
    console.log(`✅ Requiring file: ${filePath} ---> sucessed!`);
    require(filePath)(client);
  }
}

client.handleEvents();
client.handleCommands();

client.login(process.env.DEV_TOKEN);
