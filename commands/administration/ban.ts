let f = discord.command.filters;
const ADMIN_PERMS = f.and(
  f.canViewAuditLog(),
  f.canBanMembers(),
  f.canKickMembers(),
  f.canViewGuildInsights()
);
const prefix = 'p.';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.on(
  {
    name: 'ban',
    aliases: ['b'],
    filters: ADMIN_PERMS
  },
  (args) => ({
    user: args.user(),
    reason: args.textOptional()
  }),
  async (message, { user, reason }) => {
    const guild = await message.getGuild();

    await guild.createBan(user, {
      deleteMessageDays: 7,
      reason: reason || undefined
    });

    const richEmbed = new discord.Embed();
    richEmbed.setTitle('ModLog');
    richEmbed.setColor(0x00ff00);
    richEmbed.setDescription('User Banned');
    richEmbed.setFooter({
      text: 'https://pylon.bot'
    });
    richEmbed.setThumbnail({ url: user.getAvatarUrl() });
    richEmbed.addField({
      name: 'User Name',
      value: `${user.username}`,
      inline: false
    });
    richEmbed.addField({
      name: 'User ID',
      value: `${user.id}`,
      inline: false
    });
    richEmbed.addField({
      name: 'Reason',
      value: `${reason}`,
      inline: false
    });
    richEmbed.setTimestamp(new Date().toISOString());
    await message.reply(richEmbed);
    await message.addReaction('✅');
  }
);
