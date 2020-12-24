const LOADING_ICON = ' ';
const BOT_ICON = ' ';
let f = discord.command.filters;
const HELPER_PERMS = f.and(f.canManageMessages());
const prefix = 'p.';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.raw(
  {
    name: 'ping',
    aliases: ['echo', 'beep'],
    description: "Responds with the bot's ping.",
    filters: HELPER_PERMS
  },
  async (msg) => {
    const embed = new discord.Embed();
    const start = Date.now();
    const sent = await msg.reply(`${LOADING_ICON}`);
    const latency = new Date(sent.timestamp).getTime() - start;
    embed.setTitle(`**__PING__**`);
    embed.setDescription(`The ping is ${latency}ms`);
    embed.setThumbnail({ url: BOT_ICON });
    embed.setColor(0xf600ff);
    embed.setTimestamp(new Date().toISOString());
    await sent.edit({ embed: embed });
  }
);
