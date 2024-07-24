const fs = require("fs");
const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`asmr_remove`)
    .setDescription(`移除訂閱作者或聲優`)
    .addStringOption((option) =>
      option.setName(`name`).setDescription(`聲優或作者名稱`).setRequired(true)
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @return {Promise<void>}
   */
  async execute(interaction, client) {
    const folderPath = `./resource/asmr_one`;
    const tag = interaction.options.getString(`name`);
    const filePath = `${folderPath}/${interaction.guildId}.json`;
    if (!fs.existsSync(filePath)) {
      await interaction.reply({
        content: `無效操作!`,
        ephemeral: true,
      });
      return;
    }

    const jsonData = fs.readFileSync(filePath);
    const data = JSON.parse(jsonData);
    const originalLength = data.data.length;
    data.data = data.data.filter((entry) => entry.tag !== tag);

    if (data.length == originalLength) {
      await interaction.reply({
        content: `您未在此伺服器訂閱此標籤 ${tag}`,
      });
      return;
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`asmr 資料更新完成`);
    await interaction.reply({
      content: `已經成功取消訂閱 ${tag}`,
      ephemeral: true,
    });
  },
};
