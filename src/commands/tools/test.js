const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test the bot for author do not use it!! || 為開發者測試用")
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("Developer password")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const password = interaction.options.getString("password");
    if (password !== "0732") {
      await interaction.reply({
        content: "此功能僅限開發者使用。",
        ephemeral: true,
      });
      return;
    }

    const id = "873116401429250078";
    const resourceDir = "./resource";

    try {
      const files = fs.readdirSync(resourceDir);

      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = path.join(resourceDir, file);

          // Check if the filename matches the id
          if (file === `${id}.json`) {
            // Read and parse JSON file
            const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

            // Assuming jsonData.subscription[0] contains author information
            const sub_data = jsonData.subscription[0];
            await interaction.reply({
              content: `Author: ${sub_data.author}`,
              ephemeral: true,
            });
            return; // Exit function after replying
          }
        }
      }

      // If no matching file found
      await interaction.reply({
        content: "未找到該檔案",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error reading or processing files:", error);
      await interaction.reply({
        content: "處理文件時發生錯誤",
        ephemeral: true,
      });
    }
  },
};
