const { Client } = require("discord.js");
module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    console.log(`${client.user.tag} is logged in and online!!`);

    try {
      console.log("啟動檢查更新....");
      await client.hanimeAnnouncement();
      await client.nwebAnnouncement();
      await client.asmrAnnouncement();
      console.log(`檢查完成`);
    } catch (error) {
      console.error("Error during initial comic update check:", error);
    }

    setInterval(async () => {
      try {
        console.log("定期檢查更新.....");
        await client.nwebAnnouncement();
        await client.asmrAnnouncement();
        await client.asmrAnnouncement();
        console.log(`檢查完成`);
      } catch (error) {
        console.error("Error checking for comic updates:", error);
      }
    }, 3600000);
  },
};
