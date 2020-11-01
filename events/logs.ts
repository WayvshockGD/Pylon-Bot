const prefix = 'p.';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.raw('log', async (message) => {
  console.log(message);
});

cmd.raw('error', async (Error) => {
  console.log(Error);
});
