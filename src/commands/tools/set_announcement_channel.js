const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set_announcement_channel")
    .setDescription("選擇訂閱項目通知要送往的頻道")
    .addStringOption((option) =>
      option
        .setName("announcement_type")
        .setDescription("選擇通知類型")
        .setRequired(true)
        .addChoices({ name: "nhentai", value: "nhentai" })
    )
    .addStringOption((option) =>
      option
        .setName("channel_id")
        .setDescription("要移置的頻道**id**!!")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns {Promise<void>}
   */
  async execute(interaction, client) {
    const announcement = interaction.options.getString("announcement_type");
    const channelId = interaction.options.getString("channel_id");
    let resourcePath = path.join(__dirname, "../../../resource/");

    if (announcement === "nhentai") {
      resourcePath += `nweb/${interaction.guildId}.json`;
    } else {
      await interaction.reply({
        content: `輸入錯誤\n你未開啟此通知，故不可更改`,
        ephemeral: true,
      });
      return;
    }

    try {
      if (fs.existsSync(resourcePath)) {
        const jsonData = fs.readFileSync(resourcePath, "utf-8");
        const saveData = JSON.parse(jsonData);
        saveData.channel = channelId;

        fs.writeFileSync(
          resourcePath,
          JSON.stringify(saveData, null, 2),
          "utf-8"
        );
        const channel = await client.channels.fetch(channelId);

        await interaction.reply({
          content: `${interaction.user.displayName} 將 ${announcement} 的通知移至${channel.name}`,
        });
      } else {
        await interaction.reply({
          content: `未找到此伺服器的訂閱通知設定檔案`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error("Error handling set_announcement_channel command:", error);
      await interaction.reply({
        content: `處理通知設定時發生錯誤`,
        ephemeral: true,
      });
    }
  },
};
