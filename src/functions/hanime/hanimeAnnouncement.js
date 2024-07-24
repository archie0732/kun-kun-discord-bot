const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { Client, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {string} tag
 * @returns {Promise<{title :string, id: string, artist :string, video_url :string, cover_url: string}|null>}
 */
async function fetchHtml(tag) {
  const url = "https://hanime1.me/search?query=" + tag;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  await page.goto(url, { waitUntil: "networkidle2" });
  const html = await page.content();
  await browser.close();
  const $ = cheerio.load(html);

  const video_url = $("a.overlay").attr("href");
  const cover_url = $(".card-mobile-panel").find("img").eq(1).attr("src");
  const title = $(".card-mobile-title").eq(0).text();
  const artist = $(".card-mobile-user").eq(0).text();
  const match = video_url ? video_url.match(/v=(\d+)/) : null;
  const id = match ? match[1] : null;
  if (!title || !id || !artist || !video_url || !cover_url) {
    console.log(`hanime - 網站發生問題`);
    return null;
  }
  return {
    title: title,
    id: id,
    artist: artist,
    video_url: video_url,
    cover_url: cover_url,
  };
}

/**
 *
 * @param {Client} client
 * @param {string} guildID
 * @param {string} channelID
 * @param {object} data
 */
async function sendMessage(client, guildID, channelID, data) {
  const guild = await client.guilds.fetch(guildID);
  const channel = await guild.channels.fetch(channelID);

  if (!data) {
    channel.send({ content: `發生錯誤` });
    return;
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name:
        client.user.tag + " - 您訂閱的標籤: " + data.artist + ": 更新新的作品!",
      iconURL: client.user.displayAvatarURL(),
    })
    .setTitle(data.title || data.id)
    .setURL(data.video_url)
    .setThumbnail(
      `https://vdownload.hembed.com/image/icon/nav_logo.png?secure=HxkFdqiVxMMXXjau9riwGg==,4855471889`
    )
    .setImage(data.cover_url)
    .setDescription(`id: ${data.id}\nartist: ${data.artist}\n\n`)
    .setFooter({
      text: "archie0732",
    });

  await channel.send({
    embeds: [embed],
  });
}

/**
 *
 * @param {Client} client
 * @returns {Promise<void>}
 */
module.exports = (client) => {
  client.hanimeAnnouncement = async () => {
    const folder = fs.readdirSync(`./resource/hanime/`);

    for (const file of folder) {
      const filePath = `./resource/hanime/${file}`;
      const jsonData = fs.readFileSync(filePath, "utf-8");
      const hanimeData = JSON.parse(jsonData);

      for (const entry of hanimeData.data) {
        const hanime1 = await fetchHtml(entry.tag);
        if (hanime1 && hanime1.id !== entry.id) {
          entry.id = hanime1.id;
          await sendMessage(
            client,
            hanimeData.guild,
            hanimeData.channel,
            hanime1
          );
          console.log(`hanime - 發現新的更新!`);
          fs.writeFileSync(
            filePath,
            JSON.stringify(hanimeData, null, 2),
            "utf-8"
          );
          console.log(`hanime - 檔案寫入完成 ${filePath}`);
        } else if (!hanime1) {
          console.log(`hanime - 訪問網站發生問題`);
          return;
        }
      }
    }
  };
};
