const prefix = DEFAULT_PREFIX;
let cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.on(
  {
    name: 'broadcast',
    aliases: ['bc', 'bcast'],
    filters: ADMIN_PERMS
  },
  (args) => ({
    content: args.text()
  }),
  async (message, { content }) => {
    const s_channel = await discord.getGuildTextChannel(BROADCAST_CHANNEL);
    message.reply('Your Broadcast has been sent');
    message.delete();
    const embed = new discord.Embed();
    embed.setTitle(`**__BROADCAST__**`);
    embed.setDescription(`${content}`);
    embed.setThumbnail({
      url: GUILD_ICON
    });
    embed.setColor(0xf600ff);
    embed.setTimestamp(new Date().toISOString());
    s_channel?.sendMessage({ embed: embed });
  }
);