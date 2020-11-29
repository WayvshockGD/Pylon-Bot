const definitions = [
    {
      role: REACTION_ROLE_1,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_1,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_2,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_2,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_3,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_3,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_4,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_4,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_5,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_5,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_6,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_6,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_7,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_7,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_8,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_8,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_9,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_9,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_10,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_10,
      type: 'toggle'
    },
    {
      role: REACTION_ROLE_11,
      message: REACTION_MESSAGE_1,
      emoji: REACTION_EMOJI_11,
      type: 'toggle'
    }
  ];
  
  function isNumber(n: string) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }
  
  const cooldowns: { [key: string]: number } = {};
  export async function handleReactRoles(
    reaction:
      | discord.Event.IMessageReactionAdd
      | discord.Event.IMessageReactionRemove,
    add: boolean
  ) {
    if (!reaction.member) return;
    const { member } = reaction;
    if (member.user.bot === true) {
      return;
    }
    const message = reaction.messageId;
    const { emoji } = reaction;
    const found = definitions.find((definitions) => {
      if (
        typeof definitions.message !== 'string' ||
        typeof definitions.role !== 'string' ||
        typeof definitions.emoji !== 'string' ||
        typeof definitions.type !== 'string'
      ) {
        return false;
      }
      const type = definitions.type.toLowerCase();
      if (type !== 'once' && type !== 'toggle' && type !== 'remove') {
        return false;
      }
      if (definitions.message !== message) {
        return false;
      }
      if (isNumber(definitions.emoji)) {
        return typeof emoji.id === 'string' && definitions.emoji === emoji.id;
      }
      return typeof emoji.name === 'string' && emoji.name === definitions.emoji;
    });
    if (!found) {
      return;
    }
  
    const type = found.type.toLowerCase();
    if (type === 'remove' && add === false) {
      return;
    }
    if (type === 'once' && add === false) {
      return;
    }
  
    const channel = await discord.getChannel(reaction.channelId);
    if (
      !(channel instanceof discord.GuildTextChannel) &&
      !(channel instanceof discord.GuildNewsChannel)
    ) {
      return;
    }
  
    let msg: discord.Message | null;
    try {
      msg = await channel.getMessage(reaction.messageId);
    } catch (e) {
      return;
    }
    if (msg === null) {
      return;
    }
  
    const hasMyEmoji = msg.reactions.find((react) => {
      if (react.me === false) {
        return false;
      }
      if (emoji.type === discord.Emoji.Type.GUILD) {
        return emoji.id === react.emoji.id;
      }
      return emoji.name === react.emoji.name;
    });
    if (
      typeof hasMyEmoji !== 'undefined' &&
      add === true &&
      (type === 'once' || type === 'remove')
    ) {
      try {
        msg.deleteReaction(
          emoji.type === discord.Emoji.Type.GUILD
            ? `${emoji.name}:${emoji.id}`
            : `${emoji.name}`,
          reaction.userId
        );
      } catch (e) {}
    }
    if (typeof cooldowns[reaction.userId] === 'number') {
      const diff = Date.now() - cooldowns[reaction.userId];
      if (diff < 500) {
        return;
      }
    }
    cooldowns[reaction.userId] = Date.now();
  
    if (!hasMyEmoji) {
      const emjMention = found.emoji;
      // await msg.deleteAllReactionsForEmoji(
      //   emoji.type === discord.Emoji.Type.GUILD
      //     ? `${emoji.name}:${emoji.id}`
      //     : `${emoji.name}`
      // );
      await msg.addReaction(
        emoji.type === discord.Emoji.Type.GUILD
          ? `${emoji.name}:${emoji.id}`
          : `${emoji.name}`
      );
      return;
    }
    const guild = await discord.getGuild();
    const memNew = await guild.getMember(reaction.userId);
    if (memNew === null) {
      return;
    }
    let typeRole: undefined | boolean;
    if (type === 'once' && !memNew.roles.includes(found.role)) {
      await memNew.addRole(found.role);
      typeRole = true;
    } else if (type === 'remove' && memNew.roles.includes(found.role)) {
      await memNew.removeRole(found.role);
      typeRole = false;
    } else if (type === 'toggle') {
      if (memNew.roles.includes(found.role) && add === false) {
        await memNew.removeRole(found.role);
        typeRole = false;
      } else if (!memNew.roles.includes(found.role) && add === true) {
        await memNew.addRole(found.role);
        typeRole = true;
      }
    }
  }
  discord.on(
    discord.Event.MESSAGE_REACTION_ADD,
    async (reaction: discord.Event.IMessageReactionAdd) => {
      await handleReactRoles(reaction, true);
    }
  );
  
  discord.on(
    discord.Event.MESSAGE_REACTION_REMOVE,
    async (reaction: discord.Event.IMessageReactionRemove) => {
      await handleReactRoles(reaction, false);
    }
  );
  