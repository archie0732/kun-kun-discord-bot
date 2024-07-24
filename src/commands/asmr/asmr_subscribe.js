const axios = require("axios");
const fs = require("fs");
const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ChannelType, // Import ChannelType
} = require("discord.js");

/**
 * Searches for ASMR data by name.
 *
 * @param {string} keyword
 * @returns {Promise<{
 *   title: string,
 *   id: string,
 *   artist: string,
 *   character: string[],
 *   tags: string[],
 *   source: string,
 *   price: number,
 *   rate_count: number,
 *   score: number,
 *   dl_count: number,
 *   "ASMR-one-url": string,
 *   source_url: string,
 *   age_category: string,
 *   cover: string,
 *   api_author: string
 * }|null>}
 */
async function searchASMR_byName(keyword) {
  const url = `https://api.asmr-200.com/api/search/${encodeURIComponent(
    keyword
  )}`;

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
      },
    });

    const ASMR_Data = res.data;
    const latestASMR = ASMR_Data.works[0];

    const tags = latestASMR.tags.map((tag) => tag.name);
    const characters = latestASMR.vas.map((va) => va.name);

    return {
      title: latestASMR.title,
      id: latestASMR.source_id,
      artist: latestASMR.name,
      character: characters,
      age_category: latestASMR.age_category_string,
      source: latestASMR.source_type,
      tags: tags,
      rate_count: latestASMR.rate_count,
      score: latestASMR.rate_average_2dp,
      "ASMR-one-url": `https://asmr.one/work/${latestASMR.source_id}`,
      source_url: latestASMR.source_url,
      cover: latestASMR.mainCoverUrl,
      price: latestASMR.price,
      dl_count: latestASMR.dl_count,
      api_author: "archie0732",
    };
  } catch (error) {
    console.error("Error fetching ASMR data:", error.message);
    return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("asmrone_subscript")
    .setDescription("輸入標籤，當該標籤更新新內容時則會在頻道發布通知!")
    .addStringOption((option) =>
      option
        .setName("tag")
        .setDescription("Tag可以為聲優或作者")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("你可以選擇公告的頻道，不選擇則默認為發出該指令之頻道")
        .addChannelTypes([
          ChannelType.GuildText,
          ChannelType.GuildNews,
          ChannelType.GuildNewsThread,
          ChannelType.GuildPublicThread,
          ChannelType.GuildPrivateThread,
          ChannelType.GuildVoice, // Include voice channels if needed
          ChannelType.GuildStageVoice, // Include stage channels if needed
        ])
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns {Promise<void>}
   */
  async execute(interaction, client) {
    const tag = interaction.options.getString("tag");
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    const asmrData = await searchASMR_byName(tag);
    if (!asmrData) {
      await interaction.reply({
        content: "未找到相關的 ASMR 資料。",
        ephemeral: true,
      });
      return;
    }

    const folderPath = "./resource/asmr_one";
    const filePath = `${folderPath}/${interaction.guildId}.json`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    let data;
    if (fs.existsSync(filePath)) {
      const jsonData = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(jsonData);
    } else {
      data = {
        guild: interaction.guildId,
        channel: interaction.channelId,
        data: [],
      };
    }

    const existingEntry = data.data.find((entry) => entry.tag === tag);
    if (existingEntry) {
      await interaction.reply({
        content: `你已經在 ${interaction.guild.name} 訂閱過該作者了!\n可以使用 /asmrone_remove 來取消訂閱`,
        ephemeral: true,
      });
      return;
    }

    data.data.push({
      tag: tag,
      id: asmrData.id,
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    await interaction.reply({
      content: `已經訂閱成功 ${tag}。通知會在 ${channel.name} 發布通知。`,
      ephemeral: true,
    });
  },
};
