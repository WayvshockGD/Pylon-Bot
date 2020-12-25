pylon.tasks.cron('update_member_count', '0 0/5 * * * * *', async () => {
    const channel = await discord.getGuildVoiceChannel(' ');
    if (!channel) {
      return;
    }
  
    await channel.sendMessage('Member Count: ');
  });
  
  discord.on('MESSAGE_CREATE', async (message) => {
    let channel_id = ' ';
    let news_channel = await discord.getGuildNewsChannel(channel_id);
    if (message.channel.id == channel_id) {
      await news_channel.publishMessage(message.id);
    }
  });
  
  const hoistCharacters = ['!', "'", '*', '.', ';', ')', '(', '?', '`'];
  
  discord.on('USER_UPDATE', async (user: discord.User) => {
    if (hoistCharacters.some((ch) => user.username.startsWith(ch))) {
      const guild = await discord.getGuild();
      const member = await guild?.getMember(user.id);
  
      const newnick: string = user?.username?.match(/w+/)?.[0] ?? '💩';
      member?.edit({ nick: newnick });
    }
  });
  
  discord.on('GUILD_MEMBER_UPDATE', async (member: discord.GuildMember) => {
    if (hoistCharacters.some((ch) => member?.nick?.startsWith(ch))) {
      const newnick: string = member?.nick?.match(/\w+/)?.[0] ?? '💩';
      member?.edit({ nick: newnick });
    }
  });
  discord.on('GUILD_MEMBER_ADD', async (member: discord.GuildMember) => {
    if (hoistCharacters.some((ch) => member?.user.username?.startsWith(ch))) {
      const newnick: string = member?.user.username?.match(/\w+/)?.[0] ?? '💩';
      member?.edit({ nick: newnick });
    }
  });
  
  var update = '';
  
  discord.on('MESSAGE_CREATE', async (message) => {
    const channel = await discord.getGuildTextChannel(' ');
    if (update == '') {
      await channel?.sendMessage('**New script published**');
      update = 'not undefined';
    }
  });
  
  pylon.tasks.cron('Time', '0 0/5 * * * * *', async () => {
    update = 'not undefined';
  });