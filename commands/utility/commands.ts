const prefix = '!';

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
    description: 'Displays the guilds commands'
  },
  async (msg) => {
    const menu = new discord.Embed();
    await menu.setColor(0x3f888f);
    await menu.setTitle('Pylon Menu');
    await menu.setDescription(
      `Select a category?
1️⃣: Moderation Commands
2️⃣: Social Commands
3️⃣: Fun Commands
4️⃣: Utility Commands`
    );

    const thehelpmsg = await msg.reply(menu);

    await thehelpmsg.addReaction('1️⃣');
    await thehelpmsg.addReaction('2️⃣');
    await thehelpmsg.addReaction('3️⃣');
    await thehelpmsg.addReaction('4️⃣');
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
    await option1.setTitle('Moderation Commands');
    await option1.setDescription(
      '```ts\n┏ kick [@member] ● Kick a member from the guild.\n┣ ban [@member] [reason] ● Ban a member from the guild for s specified reason.\n┣ mute [@member] ● Mute a member\n┗ unmute [@member] ● Unmutes a member.\n```'
    );
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
    await option2.setTitle('Twitter Commands');
    await option2.setDescription(
      '```ts\n┏ twitter sub [Twitter Handle] [Channel] ● Subscribe to a twitter handle in the specified channel.\n┣ Twitter unsub [Twitter Handle] ● Unsuscrive from a specified Twitter Handle.\n┗ twitter list ● List all subscribed Twitter Handles.\n```'
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
    await option3.setTitle('Fun Commands');
    await option3.setDescription(
      '```ts\n┏ minesweeper ● Start a solo game of Minesweeper.\n┣ minesweeperCoop ● Start a Coop game of Minesweeper.\n┗ op [x] [y] ● Selects a square in Minesweeper.\n```'
    );

    const theMsg4 = await theMsg.reply(option3);
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
    await option4.setTitle('Utility Commands');
    await option4.setDescription(
      '```ts\n┏ ping ● Makes the bot respond with Pong!\n┣ info [@member] ● Grabs a members guild info.\n┣ rank [@member] ● Grabs a members guild rank.\n┣ top ● Returns the guild leaderboard.\n┗ menu ● Responds with the guilds menu.\n```'
    );

    const theMsg4 = await theMsg.reply(option4);
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
