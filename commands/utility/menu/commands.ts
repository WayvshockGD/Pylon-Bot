let f = discord.command.filters;
global.USER_PERMS = f.and(
  f.canSendMessages(),
  f.canEmbedLinks(),
  f.canUseExternalEmojis(),
  f.canUseVoiceActivity()
);
const prefix = ' ';

var MSGID = '';
var AUTHORID = '';
var guildId = 'GUILD ID';

const cmd = new discord.command.CommandGroup({
  defaultPrefix: prefix
});

cmd.raw(
  {
    name: 'commands',
    aliases: ['cmd'],
    description: 'Displays the guilds commands',
    filters: USER_PERMS
  },
  async (msg) => {
    const menu = new discord.Embed();
    await menu.setColor(0x3f888f);
    await menu.setTitle('Pylon Menu');
    await menu.setDescription(
      `Select a category?
1️⃣: Administration Commands
2️⃣: Moderation Commands
3️⃣: Helper Commands
4️⃣: Social Commands
5️⃣: Fun Commands
6️⃣: Utility Commands
`
    );

    const thehelpmsg = await msg.reply(menu);

    await thehelpmsg.addReaction('1️⃣');
    await thehelpmsg.addReaction('2️⃣');
    await thehelpmsg.addReaction('3️⃣');
    await thehelpmsg.addReaction('4️⃣');
    await thehelpmsg.addReaction('5️⃣');
    await thehelpmsg.addReaction('6️⃣');
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
    await option1.setTitle('Administration Commands');
    await option1.setDescription(
      " `[p]kick [@member]`: Kick a member from the guild.\n `[p]ban [@member] [reason]`: Ban a member from the guild for s specified reason.\n `[p]broadcast`: Send a Broadcast to the guild's Brodcasts channel."
    );
    const theMsg1 = await theMsg.reply(option1);
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
    await option2.setTitle('Moderation Commands');
    await option2.setDescription(
      " `[p]mute [@member]`: Mute a member\n `[p]unmute [@member]`: Unmutes a member.\n `[p]announce`: Send an announcement to the guild's Announcements channel."
    );
    const theMsg2 = await theMsg.reply(option2);
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
    await option3.setTitle('Helper Commands');
    await option3.setDescription(" `[p]ping`: Grab the bot's ping.");
    const theMsg3 = await theMsg.reply(option3);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }

  if (
    theReaction.emoji.name == '4️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option4 = new discord.Embed();
    await option4.setColor(0x3f888f);
    await option4.setTitle('Twitter Commands');
    await option4.setDescription(
      ' `[p]twitter sub [Twitter Handle] [Channel]`: Subscribe to a twitter handle in the specified channel.\n `[p]twitter unsub [Twitter Handle]`: Unsubscribe from a specified Twitter Handle.\n `[p]twitter list`: List all subscribed Twitter Handles.'
    );
    const theMsg4 = await theMsg.reply(option4);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }

  if (
    theReaction.emoji.name == '5️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option5 = new discord.Embed();
    await option5.setColor(0x3f888f);
    await option5.setTitle('Fun Commands');
    await option5.setDescription(
      '`[p]minesweeper`: Start a solo game of Minesweeper.\n `[p]minesweeperCoop`: Start a Coop game of Minesweeper.\n `[p]op [x] [y]`: Selects a square in Minesweeper.'
    );

    const theMsg5 = await theMsg.reply(option5);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
  }

  if (
    theReaction.emoji.name == '6️⃣' &&
    theReaction.messageId == MSGID &&
    theReaction.member.user.id == AUTHORID
  ) {
    const option6 = new discord.Embed();
    await option6.setColor(0x3f888f);
    await option6.setTitle('Utility Commands');
    await option6.setDescription(
      " `[p]guild`: Displayes the guild's info.\n `[p]avatar: Displa's a user's avatar.\n `[p]mc: Display's info on a specified minecraft server'.\n `[p]info [@member]`: Displays a user's guild info.\n `[p]rank [@member]`: Displays a user's guild rank.\n `[p]top`: Displays the guild leaderboard.\n `[p]economy`: Displays a list of commands for the economy system.\n `[p]menu`: Displays the guild's menu.\n `[p]commands`: Displays the guild's available commands.'"
    );

    const theMsg6 = await theMsg.reply(option6);
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
    await option8.setTitle('**Pylon Menu**');
    await option8.setDescription(`Selection Cancelled`);

    const theMsg4 = await theMsg.reply(option8);
    MSGID = '';
    AUTHORID = '';
    await theMsg.delete();
    setTimeout(() => theMsg4.delete(), 5000);
  }
});