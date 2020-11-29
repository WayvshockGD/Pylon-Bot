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
      embed.setTitle('Moderation Commands');
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
      embed.setTitle(`Help for "${cmd.executor.options.name}"`);
      embed.setDescription(
        `Description: ${cmd.executor.options.description || 'None.'}`
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

commands.on(
  {
    name: 'ban',
    category: 'Moderation',
    description: 'ban a user from the guild',
    filters: ADMIN
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
    richEmbed.setTitle('User Banned');
    richEmbed.setColor(0x00ff00);
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

commands.on(
  {
    name: 'kick',
    category: 'Moderation',
    description: 'Kick a user from the guild',
    filters: ADMIN
  },

  (ctx) => ({
    member: ctx.guildMember()
  }),

  async (message, { member }) => {
    await member.kick;
    await message.reply(`Successfully kicked ${member.toMention()}!`);
  }
);

const muteRole = MUTE_ROLE;
const muteKv = new pylon.KVNamespace('mutes');
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix,
  filters: discord.command.filters.isAdministrator()
});

async function TempMute(member: discord.GuildMember, duration: number) {
  if (!member.roles.includes(muteRole)) await member.addRole(muteRole);
  await muteKv.put(member.user.id, Date.now() + duration, {
    ifNotExists: true
  });
}

async function UnMute(member: discord.GuildMember) {
  if (member.roles.includes(muteRole)) await member.removeRole(muteRole);
  await muteKv.delete(member.user.id);
}

pylon.tasks.cron('Every_5_Min', '0 0/5 * * * * *', async () => {
  const now = Date.now();
  const items = await muteKv.items();
  const guild = await discord.getGuild();
  let toRemove: string[] = [];
  await Promise.all(
    items.map(async (val) => {
      const member = await guild.getMember(val.key);
      if (member === null || !member.roles.includes(muteRole)) {
        toRemove.push(val.key);
        return;
      }
      if (typeof val.value !== 'number') return;
      const diff = now - val.value;
      if (diff > 0) {
        await member.removeRole(muteRole);
        toRemove.push(val.key);
      }
    })
  );
  if (toRemove.length > 0) {
    await muteKv.transactMulti(toRemove, () => undefined);
  }
});

cmd.on(
  {
    name: 'mute',
    category: 'Moderation',
    description: 'mute a user',
    filters: MOD
  },
  (ctx) => ({
    member: ctx.guildMember(),
    duration: ctx.integer({ minValue: 1, maxValue: 1000000 })
  }),
  async (msg, { member, duration }) => {
    await msg.reply(async () => {
      if (member.roles.includes(muteRole))
        return 'The target is already muted!';
      await TempMute(member, duration * 1000 * 60);
      return `${
        discord.decor.Emojis.WHITE_CHECK_MARK
      } ${member.toMention()} was muted for ${duration} minutes!`;
    });
  }
);

cmd.on(
  {
    name: 'unmute',
    category: 'Moderation',
    description: 'unmute a user',
    filters: MOD
  },
  (ctx) => ({
    member: ctx.guildMember()
  }),
  async (msg, { member }) => {
    await msg.reply(async () => {
      if (!member.roles.includes(muteRole)) return 'The target is not muted!';
      await UnMute(member);
      return `${
        discord.decor.Emojis.WHITE_CHECK_MARK
      } ${member.toMention()} was un-muted!`;
    });
  }
);
