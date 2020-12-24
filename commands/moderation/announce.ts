const prefix = DEFAULT_PREFIX;
let cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.on(
  {
    name: 'announce',
    aliases: ['ann', 'a'],
    filters: MOD_PERMS
  },
  (args) => ({
    content: args.text()
  }),
  async (message, { content }) => {
    const s_channel = await discord.getGuildNewsChannel(ANNOUNCEMENT_CHANNEL);
    message.reply('Your Announcement has been sent');
    message.delete();
    const embed = new discord.Embed();
    embed.setTitle(`**__ANNOUNCEMENT__**`);
    embed.setDescription(`${content}`);
    embed.setThumbnail({
      url: GUILD_ICON
    });
    embed.setColor(0xf600ff);
    embed.setTimestamp(new Date().toISOString());
    s_channel?.sendMessage({ embed: embed });
  }
);