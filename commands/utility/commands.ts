const prefix = GUILD_PREFIX;
const commands = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

commands.on(
  {
    name: 'help',
    description: `${prefix}help [command]`,
    category: 'Support',
    filters: USER
  },
  (args) => ({
    command: args.stringOptional()
  }),
  async (message, { command }) => {
    if (!command) {
      const embed = new discord.Embed();
      embed.setTitle('Utility Commands');
      embed.setFooter({
        text: `For ${message.author.getTag()}`,
        iconUrl: message.author.getAvatarUrl()
      });

      const json: any = {};

      const commandsName = Array.from(commands.commandExecutors.keys());

      let str: any = '';

      commandsName.map(function(key: any) {
        if (
          !json.hasOwnProperty(
            commands.commandExecutors.get(key).executor.options.category
          )
        )
          json[
            commands.commandExecutors.get(key).executor.options.category
          ] = [];

        json[commands.commandExecutors.get(key).executor.options.category].push(
          key
        );
      });

      for (let category in json) {
        str += `**${category} Commands** ${json[category].join(', ')}\n`;
      }

      embed.setDescription(str);

      await message.reply({
        embed: embed
      });
    } else {
      const cmd = commands.commandExecutors.get(command);
      if (!cmd)
        return message.reply({
          embed: new discord.Embed().setDescription('Invalid command.')
        });

      const embed = new discord.Embed();
      embed.setTitle(`Help for "${commands.executor.options.name}"`);
      embed.setDescription(
        `Description: ${commands.executor.options.description || 'None.'}`
      );
      embed.addField({
        name: 'Aliases',
        value: `${
          cmd.executor.options.aliases
            ? cmd.executor.options.aliases.join(', ')
            : 'None.'
        }`,
        inline: true
      });
      embed.addField({
        name: 'Category',
        value: `${cmd.executor.options.category || 'None.'}`,
        inline: true
      });
      embed.setFooter({
        text: `For ${message.author.getTag()}`,
        iconUrl: message.author.getAvatarUrl()
      });
      await message.reply({ embed: embed });
    }
  }
);

const xpToLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100));
const levelToXp = (level: number) => level ** 2 * 100;
const randomBetween = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

const xpKV = new pylon.KVNamespace('xp');
const cooldownKV = new pylon.KVNamespace('xpCooldowns');

const sendRankCard = async (
  message: discord.Message,
  user: discord.User,
  xp: number,
  levelUp: boolean = false
) => {
  const code = `
  const image = Image.new(512, 170);
  avatar = Image.load(avatar).cropCircle();
  if (avatar.width !== 128)
    avatar.resize(128, 128);
  const font = Image.loadFont('BalooExtraBold');
  tag = Image.renderText(26, 0xfafbfcff, font, tag);
  if(tag.width > image.width - 158)
    tag = tag.resize(image.width - 188, Image.RESIZE_AUTO);
  const averageColor = avatar.averageColor();
  const f = (a,b) => {
    if (seed % (a ^ b) > (a ^ b) * 0.96) return averageColor << 8 | 0xff;
    return 0xff;
  };
  image.fill(f);
  const xp_text = Image.renderText(20, 0xd6e0ffff, font, \`\${xp}/\${next} XP\`);
  const level_text = Image.renderText(60, 0xfafbfcff, font, \`LEVEL \${level}\`);
  image.composite(avatar, 20, 20);
  image.composite(tag, 180, image.height / 6 - tag.height / 2);
  image.composite(level_text, 180, image.height / 2 - level_text.height / 2);
  image.composite(xp_text, image.width - 5 - xp_text.width, image.height - 35);
  image.drawBox(0, image.height - 4, Math.floor(xp / next * image.width), 4, 0xfbae40ff);
  image.drawBox(Math.floor((xp - prev) / (next - prev) * image.width), image.height - 4, image.width - Math.floor((xp - prev) / (next - prev) * image.width), 4, 0x6d6e71ff);
  `;

  return message.reply(async () => {
    const request = await fetch('https://fapi.wrmsr.io/image_script', {
      body: JSON.stringify({
        args: {
          text: code,
          inject: {
            avatar: user.getAvatarUrl(discord.ImageType.PNG),
            tag: user.getTag(),
            xp,
            level: xpToLevel(xp),
            next: levelToXp(xpToLevel(xp) + 1),
            prev: levelToXp(xpToLevel(xp) - 1),
            seed: (parseInt(user.id) % 1000) + 5
          }
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FAPI_TOKEN}`
      },
      method: 'POST'
    });

    if (!request.ok)
      return message.reply(
        `:x: Something went wrong generating the rank card:\n${await request.text()}`
      );

    return {
      content: levelUp
        ? `**${message.author?.getTag()}** just leveled up!`
        : '',
      attachments: [{ name: 'rank.png', data: await request.arrayBuffer() }]
    } as discord.Message.IOutgoingMessageOptions;
  });
};

discord.on(discord.Event.MESSAGE_CREATE, async (message: discord.Message) => {
  if (!message.author || message.author.bot) return;
  if (await cooldownKV.get<boolean>(message.author.id)) return;
  await cooldownKV.put(message.author.id, true, {
    ttl: randomBetween(45000, 75000) // cooldown for gaining new xp: between 45 and 75 seconds
  });

  const oldXP = (await xpKV.get<number>(message.author.id)) || 0;
  const oldLevel = xpToLevel(oldXP);

  const newXP = oldXP + randomBetween(25, 35); // xp to add: between 25 and 35
  const newLevel = xpToLevel(newXP);

  await xpKV.put(message.author.id, newXP, { ttl: 1000 * 60 * 60 * 24 * 30 }); // xp will reset after 30 days of inactivity

  if (newLevel > 0 && newLevel > oldLevel)
    await sendRankCard(message, message.author, newXP, true);
});

commands.on(
  {
    name: 'rank',
    category: 'Utility',
    description: 'Rank card',
    filters: USER
  },
  (args) => ({ user: args.userOptional() }),
  async (message, { user }) => {
    const target = user ?? message.author;

    const xp = (await xpKV.get<number>(target.id)) || 0;
    await sendRankCard(message, target, xp, false);
  }
);

commands.on(
  {
    name: 'top',
    description: 'XP leaderboard',
    category: 'Utility',
    filters: USER
  },
  () => ({}),
  async (message: discord.Message) => {
    return message.reply(async () => {
      const items = await xpKV.items();

      let top = await Promise.all(
        items
          .sort((a: any, b: any) => (b.value || 0) - (a.value || 0))
          .slice(0, 10)
          .map((entry) =>
            discord.getUser(entry.key).then((user) => ({
              value: entry.value,
              tag: user?.getTag() || 'unknown#0000',
              level: xpToLevel(entry.value as number),
              next: levelToXp(xpToLevel(entry.value as number) + 1),
              prev: levelToXp(xpToLevel(entry.value as number) - 1),
              avatar: user?.getAvatarUrl() || USER_ICON_URL
            }))
          )
      );

      const code = `
      top = JSON.parse(top);
      const image = Image.new(700, 888);
      const avatars = Image.loadMultiple(top.map(x => x.avatar));
      const g = (x, y) => Math.sin(x ^ y) / Math.cos(y ^ x) / seed;
      image.fill((x, y) => Image.rgbToColor(g(x, x), g(y, y), g(x, y)));
      avatars.forEach((avatar, index) => {
        if (avatar.width !== 64) avatar.resize(64, 64);
        avatar.cropCircle();
        image.composite(avatar, 20, 15 + (87 * index));
      });
      const font = Image.loadFont('BalooExtraBold');
      top.forEach((user, index) => {
        const tag = Image.renderText(32, 0xfafbfcff, font, user.tag);
        const level = Image.renderText(32, 0xfafbfcff, font, \`LVL \${user.level}\`);
        const xp = Image.renderText(21, 0xd6e0ffff, font, \`\${user.value.toLocaleString()} XP\`);
        if (tag.width > image.width - 35 - 40 - 64 - level.width) tag.resize(image.width - 35 - 40 - 64 - level.width, Image.RESIZE_AUTO);
        image.composite(tag, 20 + 64 + 15, 32 + (87 * index));
        image.composite(xp, image.width - 20 - xp.width, 64 + (87 * index));
        image.composite(level, image.width - 20 - level.width, 24 + (87 * index));
        image.drawBox(image.width - 20 - level.width, 55 + (87 * index),  Math.floor((user.value - user.prev) / (user.next - user.prev) * level.width), 5, 0xF38020ff);
        image.drawBox(image.width - 20 - level.width + Math.floor((user.value - user.prev) / (user.next - user.prev) * level.width), 55 + (87 * index), level.width - Math.floor((user.value - user.prev) / (user.next - user.prev) * level.width), 5, 0x6d6e71ff);
      });`;

      const request = await fetch(FAPI_IMAGE_SCRIPT, {
        body: JSON.stringify({
          args: {
            text: code,
            inject: {
              seed: randomBetween(10, 50),
              top: JSON.stringify(top)
            }
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${FAPI_TOKEN}`
        },
        method: 'POST'
      });

      if (!request.ok)
        return `:x: Something went wrong generating the rank card:\n${await request.text()}`;

      return {
        attachments: [{ name: 'top.png', data: await request.arrayBuffer() }]
      };
    });
  }
);

commands.raw(
  {
    name: 'ping',
    category: 'Utility',
    description: "responds with 'Pong!'",
    filters: USER
  },
  (msg) => {
    msg.reply(
      'Pinging...' +
        LOADING_EMOJI +
        '\n\n' +
        'Pong!' +
        '\n\n' +
        '...' +
        '\n\n' +
        'Well that was useless' +
        '...' +
        '\n\n' +
        'Maybe' +
        DEVELOPER +
        'should look into getting this command to actually do something' +
        '...'
    );
  }
);

const timeMap = new Map([
  ['decade', 1000 * 60 * 60 * 24 * 365 * 10],
  ['year', 1000 * 60 * 60 * 24 * 365],
  ['month', 1000 * 60 * 60 * 24 * 31],
  ['week', 1000 * 60 * 60 * 24 * 7],
  ['day', 1000 * 60 * 60 * 24],
  ['hour', 1000 * 60 * 60],
  ['minute', 1000 * 60],
  ['second', 1000],
  ['milisecond', 1]
]);
function getLongAgoFormat(ts: number, limiter: number) {
  let runcheck = ts + 0;
  let txt = new Map();
  for (var [k, v] of timeMap) {
    if (runcheck < v || txt.entries.length >= limiter) continue;
    let runs = Math.ceil(runcheck / v) + 1;
    for (var i = 0; i <= runs; i++) {
      if (runcheck < v) break;
      if (txt.has(k)) {
        txt.set(k, txt.get(k) + 1);
      } else {
        txt.set(k, 1);
      }
      runcheck -= v;
    }
  }
  let txtret = new Array();
  let runsc = 0;
  for (var [key, value] of txt) {
    if (runsc >= limiter) break;
    let cc = value > 1 ? key + 's' : key;
    txtret.push(value + ' ' + cc);
    runsc++;
  }
  return txtret.join(', ');
}

function pad(v: string, n: number, c = '0') {
  return String(v).length >= n
    ? String(v)
    : (String(c).repeat(n) + v).slice(-n);
}
function decomposeSnowflake(snowflake: string) {
  let binary = pad(BigInt(snowflake).toString(2), 64);
  const res = {
    timestamp: parseInt(binary.substring(0, 42), 2) + 1420070400000,
    workerID: parseInt(binary.substring(42, 47), 2),
    processID: parseInt(binary.substring(47, 52), 2),
    increment: parseInt(binary.substring(52, 64), 2),
    binary: binary
  };
  return res;
}

commands.raw(
  {
    name: 'guild-info',
    category: 'Utility',
    description: 'Display the current Guild info',
    filters: USER
  },
  async (message) => {
    let edmsg = message.reply(LOADING_EMOJI);
    let embed = new discord.Embed();
    const guild = await message.getGuild();
    if (guild === null) throw new Error('guild not found');
    let icon = guild.getIconUrl();
    if (icon === null) icon = '';
    embed.setAuthor({
      name: guild.name,
      iconUrl: USER_ICON_URL
    });
    let dtCreation = new Date(decomposeSnowflake(guild.id).timestamp);
    let diff = new Date(new Date().getTime() - dtCreation.getTime()).getTime();
    let tdiff = getLongAgoFormat(diff, 2);
    if (icon !== null) embed.setThumbnail({ url: icon });
    let desc = '';
    const formattedDtCreation = `${dtCreation.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`; /* @ ${dtCreation.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short'
  })}`;*/

    let preferredLocale =
      typeof guild.preferredLocale === 'string' &&
      guild.features.includes(discord.Guild.Feature.DISCOVERABLE)
        ? `\n  󠇰**Preferred Locale**: \`${guild.preferredLocale}\`\n`
        : '';
    let boosts =
      guild.premiumSubscriptionCount > 0
        ? `\n<:booster3:735780703773655102>**Boosts**: ${guild.premiumSubscriptionCount}\n`
        : '';
    let boostTier =
      guild.premiumTier !== null
        ? `\n  󠇰**Boost Tier**: ${guild.premiumTier}\n`
        : '';
    let systemChannel =
      guild.systemChannelId !== null
        ? `\n  󠇰**System Channel**: <#${guild.systemChannelId}>\n`
        : '';
    let vanityUrl =
      guild.vanityUrlCode !== null
        ? `\n  󠇰**Vanity Url**: \`${guild.vanityUrlCode}\``
        : '';
    let description =
      guild.description !== null
        ? `\n  󠇰**Description**: \`${guild.description}\``
        : '';
    let widgetChannel =
      guild.widgetChannelId !== null
        ? `<#${guild.widgetChannelId}>`
        : 'No channel';
    let widget =
      guild.widgetEnabled === true
        ? '\n  󠇰**Widget**: ' +
          discord.decor.Emojis.WHITE_CHECK_MARK +
          ` ( ${widgetChannel} )`
        : '';
    let features =
      guild.features.length > 0 ? guild.features.join(', ') : 'None';

    desc += `  **❯ **Information
<:rich_presence:735781410509684786>**ID**: \`${guild.id}\`
  󠇰**Created**: ${tdiff} ago **[**\`${formattedDtCreation}\`**]**
<:owner:735780703903547443>**Owner**: <@!${guild.ownerId}>
<:voice:735780703928844319>**Voice Region**: \`${guild.region}\`
  󠇰**Features**: \`${features}\`
  󠇰**Max Presences**: ${guild.maxPresences}${boosts}${boostTier}${widget}${description}${preferredLocale}${vanityUrl}${systemChannel}`;

    let chanStats = new Array();
    let counts: any = {
      text: 0,
      category: 0,
      voice: 0,
      news: 0,
      store: 0
    };
    let channels = await guild.getChannels();
    channels.forEach(function(ch) {
      if (ch.type === discord.GuildChannel.Type.GUILD_TEXT) counts.text++;
      if (ch.type === discord.GuildChannel.Type.GUILD_VOICE) counts.voice++;
      if (ch.type === discord.GuildChannel.Type.GUILD_STORE) counts.store++;
      if (ch.type === discord.GuildChannel.Type.GUILD_CATEGORY)
        counts.category++;
      if (ch.type === discord.GuildChannel.Type.GUILD_NEWS) counts.news++;
    });
    for (var k in counts) {
      let obj = counts[k];
      let emj = '';
      if (k === 'text') emj = TEXT_EMOJI;
      if (k === 'voice') emj = VOICE_EMOJI;
      if (k === 'store') emj = STORE_EMOJI;
      if (k === 'news') emj = NEWS_EMOJI;
      if (k === 'category') emj = CATEGORY_EMOJI;

      if (obj > 0)
        chanStats.push(
          '\n ' +
            emj +
            '**' +
            k.substr(0, 1).toUpperCase() +
            k.substr(1) +
            '**: **' +
            obj +
            '**'
        );
    }
    desc += '\n\n**❯ **Channels ⎯ ' + channels.length + chanStats.join('');
    const roles = await guild.getRoles();
    const emojis = await guild.getEmojis();

    desc += `
 
 
**❯ **Other Counts
 <:settings:735782884836638732> **Roles**: ${roles.length}
 <:emoji_ghost:735782884862066789> **Emojis**: ${emojis.length}`;
    let memberCounts: any = {
      human: 0,
      bot: 0,
      presences: {
        streaming: 0,
        game: 0,
        listening: 0,
        watching: 0,
        online: 0,
        dnd: 0,
        idle: 0,
        offline: 0
      }
    };
    for await (const member of guild.iterMembers()) {
      let usr = member.user;
      if (!usr.bot) {
        memberCounts.human++;
      } else {
        memberCounts.bot++;
        continue;
      }
      let pres = await member.getPresence();
      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.STREAMING;
        })
      )
        memberCounts.presences.streaming++;

      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.LISTENING;
        })
      )
        memberCounts.presences.listening++;

      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.GAME;
        })
      )
        memberCounts.presences.game++;
      if (
        pres.activities.find((e) => {
          return e.type === discord.Presence.ActivityType.WATCHING;
        })
      )
        memberCounts.presences.watching++;

      memberCounts.presences[pres.status]++;
    }
    let prestext = ``;
    let nolb = false;
    for (let key in memberCounts.presences) {
      let obj = memberCounts.presences[key];
      let emj = '';
      if (key === 'streaming') emj = STREAMING_EMOJI;
      if (key === 'game') emj = GAME_EMOJI;
      if (key === 'watching') emj = WATCHING_EMOJI;
      if (key === 'listening') emj = LISTENING_EMOJI;
      if (key === 'online') emj = ONLINE_EMOJI;
      if (key === 'dnd') emj = DND_EMOJI;
      if (key === 'idle') emj = IDLE_EMOJI;
      if (key === 'offline') emj = OFFLINE_EMOJI;

      if (obj > 0) {
        if (
          key !== 'streaming' &&
          key !== 'listening' &&
          key !== 'watching' &&
          key !== 'game' &&
          !prestext.includes('**⎯⎯⎯⎯⎯**') &&
          !nolb
        ) {
          if (prestext.length === 0) {
            nolb = true;
          } else {
            prestext += '\n**⎯⎯⎯⎯⎯**'; // add linebreak
          }
        }
        prestext += `\n ${emj} **-** ${obj}`;
      }
    }
    let bottxt = `\n <:bot:735780703945490542> **-** ${memberCounts.bot}
**⎯⎯⎯⎯⎯**`;
    if (memberCounts.bot <= 0) bottxt = '';
    desc += `
 
 
**❯ **Members ⎯ ${guild.memberCount}${bottxt}${prestext}`;
    embed.setDescription(desc);
    let editer = await edmsg;
    await editer.edit({ content: '', embed: embed });
  }
);

commands.on(
  {
    name: 'user-info',
    category: 'Utility',
    description: "Displays a user's guild info",
    filters: USER
  },
  (ctx) => ({ user: ctx.userOptional() }),
  async (msg, { user }) => {
    const loadingMsg = await msg.reply({
      allowedMentions: {},
      content: LOADING_EMOJI
    });
    if (user === null) {
      user = msg.author;
    }
    const emb = new discord.Embed();
    emb.setAuthor({ name: user.getTag(), iconUrl: user.getAvatarUrl() });
    let desc = `**❯ ${user.bot === false ? 'User' : 'Bot'} Information**
        ${CATEGORY_EMOJI} 󠇰**ID**: \`${user.id}\`
        ${discord.decor.Emojis.LINK} **Profile**: ${user.toMention()}`;
    const dtCreation = new Date(decomposeSnowflake(user.id).timestamp);
    const tdiff = getLongAgoFormat(Date.now() - dtCreation.getTime(), 2);
    const formattedDtCreation = `${dtCreation.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
    desc += `\n ${discord.decor.Emojis.CALENDAR_SPIRAL} **Created**: ${tdiff} ago **[**\`${formattedDtCreation}\`**]**`;
    const guild = await msg.getGuild();
    const member = await guild.getMember(user.id);
    if (member !== null) {
      // presences
      const presence = await member.getPresence();
      const statuses = presence.activities.map((pres) => {
        const key = pres.type;
        let emj = '';
        if (pres.type === discord.Presence.ActivityType.STREAMING) {
          emj = STREAMING_EMOJI;
        }
        if (pres.type === discord.Presence.ActivityType.GAME) {
          emj = discord.decor.Emojis.VIDEO_GAME;
        }
        if (pres.type === discord.Presence.ActivityType.WATCHING) {
          emj = WATCHING_EMOJI;
        }
        if (pres.type === discord.Presence.ActivityType.LISTENING) {
          emj = LISTENING_EMOJI;
        }
        if (pres.type === discord.Presence.ActivityType.CUSTOM) {
          let emjMention = '';
          if (pres.emoji !== null) {
            emjMention =
              pres.emoji.id === null
                ? pres.emoji.name
                : `<${pres.emoji.animated === true ? 'a' : ''}:${
                    pres.emoji.name
                  }:${pres.emoji.id}>`;
          } else {
            emjMention = discord.decor.Emojis.NOTEPAD_SPIRAL;
          }
          return `${emjMention}${
            pres.state !== null ? ` \`${pres.state}\`` : ''
          } (Custom Status)`;
        }

        return `${emj}${pres.name.length > 0 ? ` \`${pres.name}\`` : ''}`;
      });
      let emjStatus = '';
      if (presence.status === 'online') {
        emjStatus = ONLINE_EMOJI;
      }
      if (presence.status === 'dnd') {
        emjStatus = DND_EMOJI;
      }
      if (presence.status === 'idle') {
        emjStatus = IDLE_EMOJI;
      }
      if (presence.status === 'offline') {
        emjStatus = OFFLINE_EMOJI;
      }
      desc += `\n ${emjStatus} **Status**: ${presence.status
        .substr(0, 1)
        .toUpperCase()}${presence.status.substr(1).toLowerCase()}`;
      if (statuses.length > 0) {
        desc += `\n  ${statuses.join('\n  ')}󠇰`;
      }

      const roles = member.roles.map((rl) => `<@&${rl}>`).join(' ');
      desc += '\n\n**❯ Member Information**';
      const dtJoin = new Date(member.joinedAt);
      const tdiffjoin = getLongAgoFormat(Date.now() - dtJoin.getTime(), 2);
      const formattedDtJoin = `${dtJoin.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`;
      desc += `\n ${discord.decor.Emojis.INBOX_TRAY} **Joined**: ${tdiffjoin} ago **[**\`${formattedDtJoin}\`**]**`;
      if (member.nick && member.nick !== null && member.nick.length > 0) {
        desc += `\n ${discord.decor.Emojis.NOTEPAD_SPIRAL} 󠇰**Nickname**: \`${member.nick}\``;
      }
      if (member.premiumSince !== null) {
        const boostDt = new Date(member.premiumSince);
        const tdiffboost = getLongAgoFormat(Date.now() - boostDt.getTime(), 2);
        const formattedDtBoost = `${boostDt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`;
        desc += `\n ${BOOSTER_EMOJI} **Boosting since**: ${tdiffboost} ago **[**\`${formattedDtBoost}\`**]**`;
      }
      if (member.roles.length > 0) {
        desc += `\n ${discord.decor.Emojis.SHIELD} **Roles** (${member.roles.length}): ${roles}`;
      }
    }

    emb.setDescription(desc);
    await loadingMsg.edit({ content: '', embed: emb });
  }
);
