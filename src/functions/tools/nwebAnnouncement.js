const fs = require("fs");
const { Client, EmbedBuilder } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = (client) => {
  client.nwebAnnouncement = async () => {
    try {
      const nwebFiles = fs.readdirSync(`${__dirname}/../../../resource/nweb`);
      for (const file of nwebFiles) {
        const nwebJson = fs.readFileSync(
          `${__dirname}/../../../resource/nweb/${file}`,
          "utf-8"
        );
        const nwebData = JSON.parse(nwebJson);

        for (const entry of nwebData.sub) {
          const lastestComic = await client.nwebCrawler(entry.author);

          if (lastestComic && lastestComic.id != entry.id) {
            const comicURL = "https://nhentai.net/g/" + lastestComic.id;
            const embed = new EmbedBuilder()
              .setTitle(
                `📢 您訂閱的作者:  ${entry.author} \n已更新了新的漫畫:\n${lastestComic.title}`
              )
              .setURL(comicURL)
              .setThumbnail(
                `https://archive.org/download/nhentai-logo-3/nhentai-logo-3.jpg`
              )
              .setAuthor({
                name: `你最好的朋友: ${client.user.username} (～￣▽￣)～`,
                iconURL: client.user.avatarURL(),
              })
              .setDescription(
                `🎈 作者: ${entry.author}\n📖 漫畫 ID: ${lastestComic.id}\n🛜 看漫連結: ${comicURL}\n🗨️ 訂閱者: 無\n` +
                  "⌨️ 使用 `/nweb_subscribe_artist` 來訂閱更多創作者 []~(￣▽￣)~*\n⌨️ 使用 `/nweb_remove_artist` 來取消訂閱創作者q(≧▽≦q)\n\n\n" +
                  `祝你看漫愉快(～￣▽￣)～\n🔽 漫畫封面:`
              )
              .setImage(lastestComic.cover)
              .setFooter({
                text: "🚩 **本機器人為作者: archie0732，不得用於任何商業用途**",
              });

            const guild = await client.guilds.fetch(nwebData.guild);
            const channel = await guild.channels.fetch(nwebData.channel);

            await channel.send({ embeds: [embed] });

            entry.id = lastestComic.id;
            fs.writeFileSync(
              `${__dirname}/../../../resource/nweb/${file}`,
              JSON.stringify(nwebData, null, 2),
              "utf-8"
            );

            console.log(
              `已在${guild.name}發布漫畫更新通知 --> comic id: ${lastestComic.id}`
            );
          } else if (!lastestComic) {
            console.log(`未正常抓取到資料`);
          }
        }
      }
    } catch (error) {
      console.error("Error reading nweb files:", error);
    }
  };
};
