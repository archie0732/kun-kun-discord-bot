const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nweb_remove_artist")
    .setDescription("取消訂閱作者")
    .addStringOption((option) =>
      option
        .setName("artist_name")
        .setDescription("作者的名稱")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @return {Promise<void>}
   */
  async execute(interaction, client) {
    const author = interaction.options.getString("artist_name");
    const filePath = path.join(
      __dirname,
      `../../../resource/nweb/${interaction.guildId}.json`
    );

    try {
      if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath, "utf-8");
        const nwebData = JSON.parse(jsonData);
        const originalLength = nwebData.sub.length;
        nwebData.sub = nwebData.sub.filter((entry) => entry.author !== author);

        if (nwebData.sub.length === originalLength) {
          await interaction.reply({
            content: `未找到訂閱的作者: ${author}`,
            ephemeral: true,
          });
          return;
        }

        fs.writeFileSync(filePath, JSON.stringify(nwebData, null, 2), "utf-8");

        await interaction.reply({
          content: `${interaction.user.displayName} 取消訂閱作者: ${author}`,
        });
      } else {
        await interaction.reply({
          content: `未找到此伺服器的訂閱通知設定檔案`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error handling nweb_remove_artist command:", error);
      await interaction.reply({
        content: `處理取消訂閱作者時發生錯誤`,
        ephemeral: true,
      });
    }
  },
};
