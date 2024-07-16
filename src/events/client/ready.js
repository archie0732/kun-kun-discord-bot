const { client, Client } = require("discord.js");
module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    console.log(`${client.user.tag} is logged in and online!!`);
    setTimeout(client.nwebAnnouncement, 3 * 1000);
  },
};
