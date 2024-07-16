const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test_embed")
    .setDescription("test for publish a embed || 測試用"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Test embed")
      .setDescription("embed description")
      .setColor(0x18e1ee)
      .setImage(client.user.displayAvatarURL())
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setAuthor({
        url: `https://youtu.be/dQw4w9WgXcQ?si=4cpX1tXziRJ8j0nh`,
        iconURL: `https://th.bing.com/th/id/R.16bd38b877015d2c1ec98a80a0e988f1?rik=aqwxx5Mx6C%2f1qQ&pid=ImgRaw&r=0`,
        name: interaction.user.username,
      })
      .setFooter({
        text: `我不知道要寫甚麼在頁尾`,
      })
      .setURL(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
      .addFields(
        {
          name: `蔡徐坤`,
          value: `field value 1`,
          inline: true,
        },
        {
          name: `羅傑`,
          value: `field value 2`,
          inline: true,
        }
      );

    await interaction.reply({
      embeds: [embed],
    });
  },
};
