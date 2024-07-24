const { EmbedBuilder, Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.sendAnnoucement = async (
    client,
    latestComic,
    description,
    guildId,
    channelId
  ) => {
    try {
      const nwebData = await client.getBaseInformation(latestComic.id);

     if (!nwebData) {
       console.log(`nhentai - 網站發生問題`);
       return;
     }

     const fields = [];

     if (nwebData.Artists && nwebData.Artists.length > 0) {
       fields.push({
         name: "✒️ 作者",
         value: nwebData.Artists.join(", "),
         inline: true,
       });
     }

     if (nwebData.Tags && nwebData.Tags.length > 0) {
       fields.push({
         name: "🏷️ 標籤",
         value: nwebData.Tags.join(", "),
         inline: true,
       });
     }

     if (nwebData.Characters && nwebData.Characters.length > 0) {
       fields.push({
         name: "🤡 角色",
         value: nwebData.Characters.join(", "),
         inline: true,
       });
     }

     if (nwebData.Categories && nwebData.Categories.length > 0) {
       fields.push({
         name: "📥 類別",
         value: nwebData.Categories.join(", "),
         inline: true,
       });
     }

     if (nwebData.Languages && nwebData.Languages.length > 0) {
       fields.push({
         name: "🌎 語言",
         value: nwebData.Languages.join(", "),
         inline: true,
       });
     }

     if (nwebData.favorite) {
       fields.push({
         name: "❤️ 收藏數",
         value: nwebData.favorite,
         inline: true,
       });
     }

     if (nwebData.Pages && nwebData.Pages.length > 0) {
       fields.push({
         name: "📖 頁數",
         value: nwebData.Pages.join(", "),
         inline: true,
       });
     }

     const embed = new EmbedBuilder()
       .setAuthor({
         name: `${client.user.username} - ${description}`,
         iconURL: client.user.displayAvatarURL(),
       })
       .setTitle(nwebData.mainTitle || "未知標題")
       .setURL("https://nhentai.net/g/" + latestComic.id)
       .setDescription(nwebData.secondTitle || "無描述")
       .setImage(nwebData.cover || "")
       .setThumbnail(
         `https://archive.org/download/nhentai-logo-3/nhentai-logo-3.jpg`
       )
       .addFields(fields);

     const guild = await client.guilds.fetch(guildId);
     const channel = await guild.channels.fetch(channelId);

     await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  };
};
