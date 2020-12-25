const prefix = ' ';
const commands = new discord.command.CommandGroup({
  defaultPrefix: prefix
});
commands.on(
  { name: 'mc' },
  (args) => ({
    server: args.string()
  }),
  async (msg, { server }) => {
    let m = await msg.reply(
      new discord.Embed().setTitle('MC status').setDescription('Fetching info!')
    );
    let res = await fetch(`https://api.mcsrvstat.us/2/${server}`);
    res = await res.json();
    let e = new discord.Embed();
    e.setTitle(`Server info for ${server}`);
    e.addField({ name: 'IP', value: res.hostname + ':' + res.port });
    e.addField({
      name: 'Motd',
      value: res.motd.clean[0] + '\n' + res.motd.clean[1]
    });
    e.addField({
      name: 'Players',
      value: res.players.online + '/' + res.players.max
    });
    e.addField({ name: 'Version', value: res.version });
    e.setThumbnail({
      url: `https://eu.mc-api.net/v3/server/favicon/${server}`
    });
    m.edit(e);
  }
);
