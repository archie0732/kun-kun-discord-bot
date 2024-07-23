const axios = require("axios").default;
const { EmbedBuilder, Client } = require("discord.js");
const fs = require("fs");

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
  const url = `https://api.asmr-200.com/api/search/${keyword}`;

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

/**
 * Sends a message with ASMR data to a specified Discord channel.
 *
 * @param {Client} client
 * @param {string} guildID
 * @param {string} channelID
 * @param {object} asmrData
 */
async function sendMessage(client, guildID, channelID, asmrData) {
  try {
    const guild = await client.guilds.fetch(guildID);
    const channel = await guild.channels.fetch(channelID);

    if (!asmrData) {
      await channel.send({
        content: "出現抓取錯誤",
      });
      return;
    }
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `📢 ${client.user.tag} - 您訂閱的標籤更新了`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(asmrData.title)
      .setURL(asmrData["ASMR-one-url"])
      .setThumbnail(client.user.avatarURL())
      .setDescription(
        `👾 作品id: ${asmrData.id}\n🤡 作者: ${asmrData.artist}\n🛜 來源網站: [${asmrData.source}](${asmrData.source_url})\n😶‍🌫️ 年齡向: ${asmrData.age_category}\n🛒 價格: ${asmrData.price}\n⬇️下載人數: ${asmrData.dl_count}\n\n您可以使用 /asmr_subscribe 來訂閱標籤\n或是使用 /asmr_cancel 來取消訂閱`
      )
      .addFields(
        {
          name: "🎙️ 聲優",
          value: asmrData.character.join(", "),
          inline: true,
        },
        {
          name: "✒️ 相關標籤",
          value: asmrData.tags.join(", "),
          inline: true,
        },
        {
          name: "🧿 評級",
          value: `${"❤️ ".repeat(Math.round(asmrData.score))} (已有 ${
            asmrData.rate_count
          } 人評分)`,
          inline: true,
        }
      )
      .setImage(asmrData.cover)
      .setFooter({ text: "aaaaaa測試用" });

    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

/**
 * Makes ASMR announcements.
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.asmrAnnouncement = async () => {
    const folder = fs.readdirSync("./resource/asmr_one");

    for (const file of folder) {
      const filePath = `./resource/asmr_one/${file}`;
      const jsonData = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(jsonData);

      for (const entry of data.data) {
        const asmrData = await searchASMR_byName(entry.tag);
        if (asmrData && entry.id !== asmrData.id) {
          entry.id = asmrData.id;
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
          await sendMessage(client, data.guild, data.channel, asmrData);
        }
      }
    }
  };
};
