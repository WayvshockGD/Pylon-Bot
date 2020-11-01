const tagsKv = new pylon.KVNamespace('helpCommands');
var cmdPerms = ' ';
const prefix = 'p.';
const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

const bestmatches = 3;
const color = 0x8fff8;

cmd.subcommand('commands', (subcmd) => {
  subcmd.on(
    'search',
    (args) => ({
      search: args.stringOptional()
    }),
    async (message, { search }) => {
      if (!search) return message.reply(await gettag('search'));

      const keylist = await tagsKv.list();
      const result = recursiveLookup(search, keylist);
      if (result.length == 0) {
        var description = 'No close matches';
      } else {
        var description = result
          .slice(0, bestmatches)
          .toString()
          .replace(/,/g, '\n');
      }
      message.reply(
        new discord.Embed({
          title: `📃 Best results`,
          description: description,
          color: color
        })
      );
    }
  );

  subcmd.on(
    'set',
    (ctx) => ({
      key: ctx.stringOptional(),
      value: ctx.textOptional()
    }),
    async (message, { key, value }) => {
      if (!key && !value) return message.reply(await gettag('search'));

      if (!message.member.roles.includes(cmdPerms)) {
        const embed = await restricted(cmdPerms);
        return message.reply(embed);
      }

      if (!value) return message.reply('You need to set a value!');
      const oldtag = await tagsKv.get<string>(key!);
      await tagsKv.put(key!, value);
      await message.reply(
        new discord.Embed({
          title: `☑️ Tag "${key}" Set`,
          description: `**Old value**
${oldtag ?? '<unset>'}
**New value**
${value}`,
          color: color
        })
      );
    }
  );

  subcmd.default(
    (ctx) => ({
      key: ctx.string()
    }),
    async (message, { key }) => {
      await message.reply(await gettag(key));
    }
  );

  subcmd.on(
    'delete',
    (ctx) => ({
      key: ctx.stringOptional()
    }),
    async (message, { key }) => {
      if (!key) return message.reply(await gettag('search'));

      if (!message.member.roles.includes(cmdPerms)) {
        const embed = await restricted(cmdPerms);
        return message.reply(embed);
      }

      try {
        await tagsKv.delete(key);
      } catch (error) {
        await message.reply({
          content: `Unknown tag: **${key}**`,
          allowedMentions: {}
        });
        return;
      }

      await message.reply({
        content: `Tag **${key}** deleted.`,
        allowedMentions: {}
      });
    }
  );

  subcmd.raw('list', async (message) => {
    const keylist = await tagsKv.list();
    const number = await keylist.length.toString();
    const newkeylist = (await keylist.toString()).replace(/,/g, ', ');

    await message.reply(
      new discord.Embed({
        title: `**${number} tags found:** `,
        description: `${newkeylist}`,
        color: color
      })
    );
  });

  subcmd.raw('normalize', async (message) => {
    if (!message.member.roles.includes(cmdPerms)) {
      const embed = await restricted(cmdPerms);
      return message.reply(embed);
    }

    const tagNames = await tagsKv.list();
    let numNormalized = 0;
    for (const key of tagNames) {
      const keyNormalized = key.toLowerCase().trim();
      if (keyNormalized !== key) {
        const value = await tagsKv.get(key);
        await tagsKv.put(keyNormalized, value!);
        await tagsKv.delete(key);
        numNormalized += 1;
      }
    }

    await message.reply(`${numNormalized} tags normalized.`);
  });

  cmd.raw({ name: 'help', aliases: ['h'] }, async (message) => {
    message.reply(
      new discord.Embed({
        description: `
        Commands**: Reponds with a list of available commands for the specified module**\n
        \`\`\`css\nUsage: commands <module>\n\`\`\`
        Commands List**: Responds with a list of available command modules**\n
        \`\`\`css\nUsage: commands list \n\`\`\`
        Commands Search**: Searches for modules and finds the closest match**\n
        \`\`\`css\nUsage: commands search <module>\n\`\`\`
    `
      })
    );
  });
});

async function restricted(roleID: string) {
  const embed = new discord.Embed({
    title: `🚫 **Command Failed...`,
    description: `Insufficient Permissions...`,
    color: 0xfc0000
  });
  return embed;
}

function recursiveLookup(
  text: string,
  keys: Array<string>,
  matches: Array<string> = []
): Array<string> {
  if (text.length === 0) return matches;
  keys.forEach((val) => {
    if (val.includes(text) && !matches.includes(val)) matches.push(val);
  });
  return recursiveLookup(text.slice(0, -1), keys, matches);
}

async function gettag(key: string) {
  const value = await tagsKv.get<string>(key);
  if (value === undefined) {
    const keylist = await tagsKv.list();
    const result = recursiveLookup(key, keylist);
    if (result.length == 0) {
      var description = 'No close matches';
    } else {
      var description = result
        .slice(0, bestmatches)
        .toString()
        .replace(/,/g, '\n');
    }

    const embed = new discord.Embed({
      title: `⚠️ No results for: ${key}`,
      description:
        `**Did you mean:**
` + description,
      color: color
    });
    return embed;
  } else {
    const embed = new discord.Embed({
      title: `:notebook_with_decorative_cover: **${key}**`,
      description: `**${value}**`,
      color: color
    });
    return embed;
  }
}
