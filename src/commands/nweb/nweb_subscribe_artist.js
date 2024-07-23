const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`nweb_subscribe_arist`)
    .setDescription(`subscribe nhentai artist`)
    .addStringOption((option) =>
      option
        .setName(`artist_name`)
        .setDescription(
          `!!注意一定要是nhentai上在artist tag的作者名!!(英文，遇到空格要用-來連接!!)`
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName(`channel_name`)
        .setDescription(`選擇通知發送頻道，不設定預設為發公告的頻道`)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @return {Promise<void>}
   */
  async execute(interaction, client) {
    const artist = interaction.options.getString(`artist_name`);
    const channels = interaction.options.getChannel(`channel`);
    const lastest = await client.nwebCrawler(artist);

    if (!lastest) {
      interaction.reply({
        content: `未查詢到這位作者: ${artist}， 或是在查詢中發生問題`,
        ephemeral: true,
      });
      return;
    }
    const data = await client.nwebGetJson(interaction);
    const guild = await client.guilds.fetch(data.guild);
    const channel = await guild.channels.fetch(data.channel);
    for (const entry of data.sub) {
      if (entry.author == artist) {
        found = false;
        interaction.reply({
          content:
            `該伺服器已經訂閱作者: ${artist}\n你可以在**${channel.name}**查看\n` +
            "或是使用`/set_announcement_channel`來改變通知所在的聊天室",
          ephemeral: true,
        });
        return;
      }
    }

    if (channels) {
      channelId = channel.id;
    } else {
      channelId = interaction.channel.id;
    }

    await client.nwebChangeId(interaction, artist, lastest.id, channelId);

    interaction.reply({
      content: `你已經成功訂閱作者${artist}了\n通知會在${channel.name}發布`,
      ephemeral: true,
    });
  },
};
