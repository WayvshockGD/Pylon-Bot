const BOT_ROLE = ' ';
const MEMBER_ROLE = ' ';
const FAPI_TOKEN = ' ';
const JOIN_LEAVE_CHANNEL = ' ';
const joinLeaveImage = async (
  join: boolean,
  member: discord.GuildMember | discord.Event.IGuildMemberRemove
) => {
  const channel = await discord.getGuildTextChannel(JOIN_LEAVE_CHANNEL);
  if (!channel) throw new Error('Invalid channel');

  const code = `
      const avatar = Image.load(avatarURL);
      const avgAvatarColor = avatar.averageColor();
      const image = Image.new(1024, 256, avgAvatarColor);

      image.lightness(0.75);
      let border = Image.new(image.width, image.height);

      border.fill((x, y) => {
        const alpha = Math.max(
          (Math.max(x, border.width - x) / border.width) ** 10,
          (Math.max(y, border.height - y) / border.height) ** 5,
        );

        return avgAvatarColor & 0xffffff00 | alpha * 0xff;
      });

      border.lightness(0.25);
      image.composite(border, 0, 0);
      avatar.resize(image.height * 0.75, Image.RESIZE_AUTO);

      avatar.cropCircle();
      image.composite(avatar, image.width * 0.05, image.height / 8);

      const message = \`\${tag} just \${join ? 'joined' : 'left'}!\`;
      const text = Image.renderText(1280 / message.length, avgAvatarColor > 0xaaaaaaff ? 0x000000ff : 0xffffffff, 'Roboto', message);

      image.composite(text, image.width * 0.1 + image.height * 0.75, image.height / 2 - text.height / 2);
      if(!join) image.saturation(0.25);
    `;

  const request = await fetch('https://fapi.wrmsr.io/image_script', {
    body: JSON.stringify({
      args: {
        text: code,
        inject: {
          tag: member.user.getTag(),
          avatarURL: member.user.getAvatarUrl(),
          join
        }
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${FAPI_TOKEN}`
    },
    method: 'POST'
  });

  if (!request.ok) throw new Error(await request.text());

  channel.sendMessage({
    attachments: [
      {
        name: join ? 'join.png' : 'leave.png',
        data: await request.arrayBuffer()
      }
    ]
  });
};

discord.on(discord.Event.GUILD_MEMBER_ADD, async (member) => {
  if (member.user.bot) await member.addRole(BOT_ROLE);
  else await member.addRole(MEMBER_ROLE);
  await joinLeaveImage(true, member);
});

discord.on(discord.Event.GUILD_MEMBER_REMOVE, async (member) => {
  await joinLeaveImage(false, member);
});
