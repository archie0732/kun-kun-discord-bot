const fs = require("fs");
const path = require("path");
const { ChatInputCommandInteraction } = require("discord.js");

module.exports = (client) => {
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {string} author
   * @param {string} id
   * @return {Promise<void>}
   */
  client.nwebChangeId = async (interaction, author, id) => {
    try {
      const nwebDir = path.resolve(__dirname, "../../../resource/nweb");
      const folderContents = fs.readdirSync(nwebDir);
      const guildId = interaction.guildId;
      let fileFound = false;

      for (const file of folderContents) {
        if (file === `${guildId}.json`) {
          fileFound = true;
          const filePath = path.join(nwebDir, file);
          const jsonData = fs.readFileSync(filePath, "utf-8");
          const data = JSON.parse(jsonData);

          let authorFound = false;
          for (const entry of data.sub) {
            if (entry.author == author && entry.id == id) {
              return;
            } else if (entry.author === author) {
              entry.id = id;
              authorFound = true;
              break;
            }
          }

          if (!authorFound) {
            data.sub.push({ author: author, id: id });
          }

          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
          console.log(`Updated ${author} with id ${id} in guild ${guildId}`);
          break;
        }
      }

      if (!fileFound) {
        console.log(`No file found for guild ${guildId}`);
      }
    } catch (error) {
      console.error("Change nweb JSON data error: " + error);
    }
  };
};
