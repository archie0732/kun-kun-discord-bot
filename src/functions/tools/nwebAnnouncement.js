const fs = require("fs");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 * @returns {Promise<void>}
 */
module.exports = (client) => {
  client.nwebAnnouncement = async () => {
    try {
      const nwebFiles = fs.readdirSync(`${__dirname}/../../../resource/nweb`);
      for (const file of nwebFiles) {
        const filePath = `${__dirname}/../../../resource/nweb/${file}`;
        const nwebJson = fs.readFileSync(filePath, "utf-8");
        const nwebData = JSON.parse(nwebJson);

        for (const entry of nwebData.sub) {
          try {
            const latestComic = await client.nwebCrawler(entry.author);

            if (latestComic && latestComic.id != entry.id) {
              await client.sendAnnoucement(
                client,
                latestComic,
                `您訂閱的作者更新了新漫畫:`,
                nwebData.guild,
                nwebData.channel
              );
              entry.id = latestComic.id;
              fs.writeFileSync(
                filePath,
                JSON.stringify(nwebData, null, 2),
                "utf-8"
              );
            } else if (!latestComic) {
              console.log(`No data fetched for author: ${entry.author}`);
            }
          } catch (innerError) {
            console.error(
              `Error processing entry for author ${entry.author}:`,
              innerError
            );
          }
        }
      }
    } catch (error) {
      console.error("Error reading nweb files:", error);
    }
  };
};


