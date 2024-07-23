const axios = require("axios");
const cheerio = require("cheerio");
const { Client } = require("discord.js");
const fs = require("fs");

/**
 *
 * @param {Client} client
 * @returns {Promise<{mainTitle: string, secondTitle: string, tags: string[], cover: string, favorite: string}> | null}
 */

module.exports = (client) => {
  client.getBaseInformation = async (id) => {
    try {
      const url = "https://nhentai.net/g/" + id.replace("#", "");
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      const mainTitle = $("h1").text();
      const secondTitle = $("h2").text();

      const allTags = {
        mainTitle: mainTitle,
        secondTitle: secondTitle,
      };

      $("#tags .tag-container").each(function () {
        const tags = $(this)
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim()
          .replace(":", "");
        const tag = $(this)
          .find(".tags .tag")
          .map(function () {
            return $(this).find(".name").text().trim();
          })
          .get();

        allTags[tags] = tag;
      });

      const coverURL = $("#cover").find("img").attr("data-src");
      const favorite = $(".buttons")
        .find("span.nobold")
        .text()
        .replace("(", "")
        .replace(")", "");

      allTags["cover"] = coverURL;
      allTags["favorite"] = favorite;

      return allTags;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
};
