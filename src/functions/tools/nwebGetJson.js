const { ChatInputCommandInteraction } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @returns {Promise<Object|null>}
   */
  client.nwebGetJson = async (interaction) => {
    try {
      const nwebDir = path.resolve(__dirname, "../../../resource/nweb");
      const nwebFolders = fs.readdirSync(nwebDir);
      const guildId = interaction.guildId;
      let found = false;
      let jsonData = null;

      for (const nwebData of nwebFolders) {
        if (nwebData === `${guildId}.json`) {
          found = true;
          const filePath = path.join(nwebDir, nwebData);
          const fileContent = fs.readFileSync(filePath, "utf-8");
          jsonData = JSON.parse(fileContent);
          break;
        }
      }

      if (!found) {
        jsonData = {
          guild: guildId,
          channel: interaction.channelId,
          sub: [],
        };

        const newFilePath = path.join(nwebDir, `${guildId}.json`);
        fs.writeFileSync(
          newFilePath,
          JSON.stringify(jsonData, null, 2),
          "utf-8"
        );

        console.log(`Added new file for guild: ${guildId}`);
      }

      return jsonData;
    } catch (error) {
      console.error("Error reading or writing JSON file:", error);
      return null;
    }
  };
};
