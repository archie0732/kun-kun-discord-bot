const { Client } = require("discord.js");
const fs = require("fs");

/**
 * @param {Client} client
 */
module.exports = (client) => {
  client.handleEvents = async () => {
    const evenFolder = fs.readdirSync(`./src/events`);
    for (const folder of evenFolder) {
      const evenFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));

      switch (folder) {
        case "client":
          for (const file of evenFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once)
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;

        default:
          break;
      }
    }
  };
};
