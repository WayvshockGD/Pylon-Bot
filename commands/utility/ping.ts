const prefix = DEFAULT_PREFIX;
const commandsUtility = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

commandsUtility.raw(
  {
    name: 'ping',
    aliases: ['echo', 'beep'],
    description: 'Responds with Pong!',
    filters: USER_PERMS
  },
  (msg) => {
    let color = 0x007acc;
    let embed = new discord.Embed();
    embed.setTitle('<a:loading:735794724480483409>');
    embed.setDescription('Pong!');
    embed.setColor(color);
    msg.reply({ content: '', embed: embed });
  }
);