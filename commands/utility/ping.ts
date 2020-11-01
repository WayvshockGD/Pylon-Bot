const prefix = 'p.';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.raw('ping', (msg) => {
  let color = 0x007acc;
  let embed = new discord.Embed();
  embed.setTitle('<a:loading:735794724480483409>');
  embed.setDescription('Pong!');
  embed.setColor(color);
  msg.reply({ content: '', embed: embed });
});
