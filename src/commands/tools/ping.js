const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Return my ping || 回傳客戶端與api延遲"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */

  async execute(interaction, client) {
    try {
      await interaction.deferReply({ fetchReply: true });

      const message = await interaction.fetchReply();

      const newMessage = `🔍API Latency: ${client.ws.ping}ms\n🛜 Client Ping: ${
        message.createdTimestamp - interaction.createdTimestamp
      }ms`;

      await interaction.editReply({
        content: newMessage,
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "There was an error trying to execute that command!",
      });
    }
  },
};
