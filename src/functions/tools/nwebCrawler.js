const axios = require("axios");
const cheerio = require("cheerio");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = (client) => {
  /**
   * Fetches the details of the last uploaded book by an author.
   * @param {string} author - The name of the author.
   * @returns {Promise<{title: string, id: string, cover: string}|null>} - An object containing book details or null if an error occurs.
   */
  client.nwebCrawler = async (artistName) => {
    const url = "https://nhentai.net/artist/" + artistName;

    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
        },
      });
      const $ = cheerio.load(res.data);

      const lastBookElement = $(".gallery").first();

      if (!lastBookElement.length) {
        throw new Error("No gallery elements found.");
      }

      const lastBookName = lastBookElement.find(".caption").text();
      const lastBookHref = lastBookElement.find("a").attr("href");
      const lastBookId = lastBookHref ? lastBookHref.split("/")[2] : null;
      const imgURL =
        lastBookElement.find("img").attr("data-src") ||
        lastBookElement.find("img").attr("src");

      return {
        title: lastBookName,
        id: lastBookId,
        cover: imgURL,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
};
