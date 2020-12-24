let f = discord.command.filters;

// settings
global.DEFAULT_PREFIX = ' ';
global.POTATO_LOTTERY_CHANNEL = ' ';

// api TOKENs
global.FAPI_TOKEN = ' ';
global.TWITTER_API = ' ';

// bearer TOKENs
global.TWITTER_BEARER =
  ' ';

// role IDs
global.ADMIN_ROLE = ' ';
global.MUTE_ROLE = ' ';
global.MEMBER_ROLE = ' ';
global.BOT_ROLE = ' ';

// icon URLs
global.TWITTER_ICON =
  ' ';
global.GUILD_ICON =
  ' ';

// channel IDs
global.JOIN_LEAVE_CHANNEL = ' ';
global.ANNOUNCEMENT_CHANNEL = ' ';
global.BROADCAST_CHANNEL = ' ';

// filters
global.ADMIN_PERMS = f.and(
  f.canViewAuditLog(),
  f.canBanMembers(),
  f.canKickMembers(),
  f.canViewGuildInsights()
);
global.MOD_PERMS = f.and(
  f.canMuteMembers(),
  f.canManageMessages(),
  f.canManageRoles()
);
global.HELPER_PERMS = f.and(f.canManageMessages());
global.USER_PERMS = f.and(
  f.canSendMessages(),
  f.canEmbedLinks(),
  f.canUseExternalEmojis(),
  f.canUseVoiceActivity()
);
