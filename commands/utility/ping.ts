const prefix = DEFAULT_PREFIX;
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.raw(
  {
    name: 'ping',
    aliases: ['echo', 'beep'],
    description: 'Responds with Pong!',
    filters: USER_PERMS
  },
  async (msg) => {
    const start = Date.now();
    const sent = await msg.reply('<a:loading:735794724480483409>');
    const latency = new Date(sent.timestamp).getTime() - start;

    await msg.reply(`The ping is ${latency}ms`);
  }
);