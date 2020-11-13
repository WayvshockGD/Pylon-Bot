const prefix = '!'
let cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});
let f = discord.command.filters;
cmd.on(
  {
    name: 'broadcast',
    aliases: ['bc'],
    filters: ADMIN_PERMS
  },
  (args) => ({ text: args.text() }),
  async (message, { text }) => {
    let guild = await discord.getGuild();
    let channels = await guild.getChannels();
    for (let i = 0; i < channels.length; i++) {
      let item = channels[i];
      if (
        item instanceof discord.GuildTextChannel &&
        item.id !== message.channelId
      ) {
        await item.sendMessage({
          content: `**Broadcast**: ${text}`,
          tts: true
        });
      }
    }
  }
);
