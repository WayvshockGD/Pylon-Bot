// GUILD
global.GUILD_PREFIX = ' ';
global.DEVELOPER = '` `';

// MANAGERS
import KVManager from './managers/kvManager';

(async () => {
  await KVManager.set('asdf', 20);
  const v = await KVManager.get('asdf');
})();

// SCRIPTS
global.TWITTER_TIMELINE_JSON =
  'https://api.twitter.com/1.1/statuses/user_timeline.json';
global.TWITTER_USER = 'https://api.twitter.com/2/users/by/username/';
global.TWITTER_USERS = 'https://api.twitter.com/2/users';
global.FAPI_IMAGE_SCRIPT = 'https://fapi.wrmsr.io/image_script';

// USER ROLES
global.MEMBER_ROLE = ' ';
global.BOT_ROLE = ' ';
global.ADMIN_ROLE = ' ';
global.MUTE_ROLE = ' ';

// REACTION ROLES
global.REACTION_ROLE_1 = ' ';
global.REACTION_ROLE_2 = ' ';
global.REACTION_ROLE_3 = ' ';
global.REACTION_ROLE_4 = ' ';
global.REACTION_ROLE_5 = ' ';
global.REACTION_ROLE_6 = ' ';
global.REACTION_ROLE_7 = ' ';
global.REACTION_ROLE_8 = ' ';
global.REACTION_ROLE_9 = ' ';
global.REACTION_ROLE_10 = ' ';
global.REACTION_ROLE_11 = ' ';

global.REACTION_EMOJI_1 = ' ';
global.REACTION_EMOJI_2 = ' ';
global.REACTION_EMOJI_3 = ' ';
global.REACTION_EMOJI_4 = ' ';
global.REACTION_EMOJI_5 = ' ';
global.REACTION_EMOJI_6 = ' ';
global.REACTION_EMOJI_7 = ' ';
global.REACTION_EMOJI_8 = ' ';
global.REACTION_EMOJI_9 = ' ';
global.REACTION_EMOJI_10 = ' ';
global.REACTION_EMOJI_11 = ' ';

global.REACTION_MESSAGE_1 = ' ';
global.REACTION_MESSAGE_2 = ' ';

// IMAGES
global.TWITTER_ICON =
  'https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png';
global.PYLON_ICON =
  'https://cdn.discordapp.com/avatars/270148059269300224/9e0eebeb511f110f28c0f901467c8620.png?size=1024';
global.USER_ICON_URL =
  'https://cdn.discordapp.com/emojis/735781410509684786.png?v=1';

// Emoji
global.LOADING_EMOJI = '<a:LOADING:780677152932364328>';
global.TEXT_EMOJI = discord.decor.Emojis.NOTEBOOK;
global.VOICE_EMOJI = discord.decor.Emojis.SPEAKING_HEAD;
global.STORE_EMOJI = discord.decor.Emojis.CONVENIENCE_STORE;
global.NEWS_EMOJI = discord.decor.Emojis.NEWSPAPER;
global.CATEGORY_EMOJI = discord.decor.Emojis.SMALL_RED_TRIANGLE_DOWN;
global.STREAMING_EMOJI = discord.decor.Emojis.RECORD_BUTTON;
global.GAME_EMOJI = discord.decor.Emojis.VIDEO_GAME;
global.WATCHING_EMOJI = discord.decor.Emojis.TV;
global.LISTENING_EMOJI = discord.decor.Emojis.MUSICAL_NOTE;
global.ONLINE_EMOJI = discord.decor.Emojis.SUNRISE;
global.DND_EMOJI = discord.decor.Emojis.NO_ENTRY_SIGN;
global.IDLE_EMOJI = discord.decor.Emojis.CRESCENT_MOON;
global.OFFLINE_EMOJI = discord.decor.Emojis.NEW_MOON;
global.BOOSTER_EMOJI = discord.decor.Emojis.DIAMOND_SHAPE_WITH_A_DOT_INSIDE;

// CHANNEL IDS
global.JOIN_LEAVE_CHANNEL = ' ';
global.POTATO_LOTTERY_CHANNEL = ' ';

// API TOKENS
global.FAPI_TOKEN = ' ';
global.TWITTER_API = ' ';
global.TWITTER_BEARER =' ';

// PERMISSIONS
let f = discord.command.filters;

global.ADMIN = f.and(
  f.canSendMessages(),
  f.canSendTtsMessages(),
  f.canViewAuditLog(),
  f.canBanMembers(),
  f.canKickMembers(),
  f.canViewGuildInsights(),
  f.canManageMessages(),
  f.canCreateInstantInvite(),
  f.canDeafenMembers(),
  f.canManageChannels(),
  f.canManageEmojis(),
  f.canManageGuildWebhooks(),
  f.canManageGuild(),
  f.canMoveMembers(),
  f.canPrioritySpeaker(),
  f.canManageChannelWebhooks(),
  f.canUseVoiceActivity(),
  f.canUseExternalEmojis()
);
global.MOD = f.and(
  f.canMuteMembers(),
  f.canManageMessages(),
  f.canManageRoles(),
  f.canDeafenMembers(),
  f.canManageChannels(),
  f.canMoveMembers(),
  f.canSendMessages(),
  f.canSendTtsMessages(),
  f.canUseExternalEmojis(),
  f.canUseVoiceActivity(),
  f.canSpeak(),
  f.canStream(),
  f.canUseExternalEmojis(),
  f.canConnect(),
  f.canReadMessages(),
  f.canReadMessageHistory()
);
global.HELPER = f.and(
  f.canManageMessages(),
  f.canSendTtsMessages(),
  f.canSendMessages(),
  f.canUseExternalEmojis(),
  f.canUseVoiceActivity(),
  f.canSpeak(),
  f.canStream(),
  f.canUseExternalEmojis(),
  f.canConnect(),
  f.canReadMessages(),
  f.canReadMessageHistory()
);
global.USER = f.and(
  f.canSendMessages(),
  f.canUseExternalEmojis(),
  f.canUseVoiceActivity(),
  f.canSpeak(),
  f.canStream(),
  f.canUseExternalEmojis(),
  f.canConnect(),
  f.canReadMessages(),
  f.canReadMessageHistory()
);
