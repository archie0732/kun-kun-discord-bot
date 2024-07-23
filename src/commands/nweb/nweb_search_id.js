const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios").default;
const cheerio = require("cheerio");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`nweb_search_comic`)
    .setDescription(`使用番號來查詢書籍`)
    .addStringOption((option) =>
      option.setName(`comic_id`).setDescription(`番號id`).setRequired(true)
    )
    .addMentionableOption((option) =>
      option.setName(`member`).setDescription(`你要tag的人`)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const id = interaction.options.getString("comic_id");
    const mentionable = interaction.options.getMentionable(`member`);
    const nwebData = await client.getBaseInformation(id);

    if (!nwebData) {
      await interaction.reply({
        content: "無法找到相關書籍資料，請稍後再試。",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username} - 這是您查詢的${id}的結果`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(nwebData.mainTitle)
      .setURL("https://nhentai.net/g/" + id)
      .setDescription(
        `${nwebData.secondTitle}\n\n您也可以使用\`nweb_subscribe_artists 來訂閱該作者`
      )
      .setImage(nwebData.cover)
      .setThumbnail(
        `https://archive.org/download/nhentai-logo-3/nhentai-logo-3.jpg`
      )
      .addFields(
        {
          name: "✒️ 作者",
          value: nwebData["Artists"].join(", "),
          inline: true,
        },
        { name: "🏷️ 標籤", value: nwebData["Tags"].join(", "), inline: true },
        {
          name: "🤡 角色",
          value: nwebData["Characters"].join(", "),
          inline: true,
        },
        {
          name: "📥 類別",
          value: nwebData["Categories"].join(", "),
          inline: true,
        },
        {
          name: "🌎 語言",
          value: nwebData["Languages"].join(", "),
          inline: true,
        },
        { name: "❤️ 收藏數", value: nwebData.favorite, inline: true },
        { name: "📖 頁數", value: nwebData["Pages"].join(", "), inline: true }
      );

    await interaction.reply({
      content: mentionable,
      embeds: [embed],
      ephemeral: true,
    });
  },
};
