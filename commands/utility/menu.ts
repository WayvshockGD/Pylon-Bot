import './menu/commands';

let f = discord.command.filters;
global.USER_PERMS = f.and(
  f.canSendMessages(),
  f.canEmbedLinks(),
  f.canUseExternalEmojis(),
  f.canUseVoiceActivity()
);
const prefix = 'p.';

var MSGID = '';
var AUTHORID = '';
var guildId = 'GUILD ID';

const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.raw(
  {
    name: 'menu',
    aliases: ['help', 'h', 'Menu', 'Help', 'H'],
    description: 'Displays the Pylon Menu',
    filters: USER_PERMS
  },
  async (msg) => {
    const menu = new discord.Embed();
    await menu.setColor(0x3f888f);
    await menu.setTitle('Pylon Menu');
    await menu.setDescription(
      `Select an option.
1️⃣: Pylon Commands
2️⃣: Potato Economy
3️⃣: Rules and TOS
`
    );

    const thehelpmsg = await msg.reply(menu);

    await thehelpmsg.addReaction('1️⃣');
    await thehelpmsg.addReaction('2️⃣');
    await thehelpmsg.addReaction('3️⃣');
    await thehelpmsg.addReaction('❌');

    MSGID = thehelpmsg.id;
    AUTHORID = msg.author.id;
  }
);

discord.registerEventHandler('MESSAGE_REACTION_ADD', async (theReaction) => {
  const guild = await discord.getGuild(guildId);
  const theMsgChannel = await discord.getGuildTextChannel(
    theReaction.channelId
  );
  const theMsg = await theMsgChannel.getMessage(theReaction.messageId);

  if (
    theReaction.emoji.name == '1️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option1 = new discord.Embed();
    await option1.setColor(0x3f888f);
    await option1.setTitle('Pylon Menu');
    await option1.setDescription('Need a list of commands? Use `[p]commands`');
    const theMsg2 = await theMsg.reply(option1);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }

  if (
    theReaction.emoji.name == '2️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option2 = new discord.Embed();
    await option2.setColor(0x3f888f);
    await option2.setTitle('Pylon Menu');
    await option2.setDescription(
      'Need a list of Potato Ecomony commands? Use `[p]potato help`'
    );
    const theMsg3 = await theMsg.reply(option2);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }
  if (
    theReaction.emoji.name == '3️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option3 = new discord.Embed();
    await option3.setColor(0x3f888f);
    await option3.setTitle('Pylon Menu');
    await option3.setDescription(
      '・ **NO** personal attacks, accusations, harassment,\nsexism, racism, or general malicious behavior. This\nincludes, but is not limited to comments that we deem\nto be of this nature.\n・ Please use the correct channels, all spam of\ncommands should also only be in the botspam\nchannel.\n・ **DO NOT** ping or **DM** the Mods or Admins\nunless they are needed.\n・ **NO** unpleasant behavior, this includes but is not\nlimited to: spamming chats, posting invite links, self \nbots, hacking, trolling, raids, etc.\n・ **DO NOT** beg for roles.\n・ **DO NOT** falsely report users.\n・ **DO NOT** ping people without a good reason.\n・ You need to follow discords terms of service\nlocated at: `https://discord.com/terms`\n**By joining this server, you have agreed to all of the**\n**above, and by using Discord you agree to using the**\n**TOS**'
    );

    const theMsg4 = await theMsg.reply(option3);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }
  if (
    theReaction.emoji.name == '❌' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option8 = new discord.Embed();
    await option8.setColor(0x3f888f);
    await option8.setTitle('**Canceled**');
    await option8.setDescription(`You chanceled the command selection`);

    const theMsg4 = await theMsg.reply(option8);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
    setTimeout(() => theMsg4.delete(), 5000);
  }
});
