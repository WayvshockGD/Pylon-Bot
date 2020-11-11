const prefix = '!';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.on(
  { name: 'kick', filters: discord.command.filters.canKickMembers() },

  (ctx) => ({
    member: ctx.guildMember()
  }),

  async (message, { member }) => {
    await member.kick;
    await message.reply(`Successfully kicked ${member.toMention()}!`);
  }
);

