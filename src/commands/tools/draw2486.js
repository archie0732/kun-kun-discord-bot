const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("draw2486")
    .setDescription("draw one person to become 2486 || 抽取一人成為2486"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    try {
      if (!interaction.guild) {
        await interaction.reply("Please run this command within a server.");
        return;
      }
      await interaction.guild.members.fetch();

      const members = interaction.guild.members.cache.filter(
        (member) => !member.user.bot
      );

      const membersArray = Array.from(members.values());

      const randomMember =
        membersArray[Math.floor(Math.random() * membersArray.length)];

      console.log(`${randomMember.displayName} is 2486`);

      const embed = new EmbedBuilder()
        .setTitle(`${randomMember.displayName}! 羅傑說你是2486`)
        .setDescription(
          `🎉 ${randomMember.displayName} 被羅傑抽到並成為2486 ~ \n恭喜 (～￣▽￣)～`
        )
        .setColor("#18ee1e")
        .setFooter({
          text: "📢 抽取為隨機的，請你抽取下位倒楣蛋成為2486的夥伴吧!",
        })
        .setThumbnail(randomMember.user.displayAvatarURL({ dynamic: true }))
        .setImage(
          "https://numeroscop.net/img/numbers/numerology/angel/2486.png"
        )
        .setAuthor({
          name: client.user.tag,
          iconURL: client.user.avatarURL(),
        })
        .setTimestamp(Date.now());

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error executing command:", error);
      await interaction.reply(
        "An error occurred while processing the command."
      );
    }
  },
};
