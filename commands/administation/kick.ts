const prefix = '!';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.on(
  {
    name: 'kick',
    aliases: ['k'],
    filters: ADMIN_PERMS
  },
  (ctx) => ({
    member: ctx.guildMember()
  }),

  async (message, { member }) => {
    await member.kick;
    await message.reply(`Successfully kicked ${member.toMention()}!`);
  }
);

