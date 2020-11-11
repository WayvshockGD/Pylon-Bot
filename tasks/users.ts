const VOICE_CHANNEL_ID = ' ';

pylon.tasks.cron('update_member_count', '0 0/5 * * * * *', async () => {
  const channel = await discord.getGuildVoiceChannel(VOICE_CHANNEL_ID);
  if (!channel) {
    return;
  }

  const guild = await discord.getGuild(channel.guildId);
  if (!guild) {
    return;
  }

  await channel.edit({
    name: `Members: ${guild.memberCount.toLocaleString()}`
  });
});
