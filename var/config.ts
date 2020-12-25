// Prefix
const prefix = 'p.';

// Channels
const JOIN_LEAVE_CHANNEL = ' ';
const BROADCAST_CHANNEL = ' ';
const ANNOUNCEMENTS_CHANNEL = ' ';
const LOG_CHANNEL = ' ';
const MEMBER_COUNT_CHANNEL = ' ';

// API
const FAPI_TOKEN = ' ';
const TWITTER_API = ' ';
const TWITTER_BEARER = ' ';

// Icons
const TWITTER_ICON = 'https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png';
const GUILD_ICON = ' ';
const BOT_ICON = ' ';
const LOADING_ICON = ' ';

// Permissions
let f = discord.command.filters;
const ADMIN_PERMS = f.and(
    f.canViewAuditLog(),
    f.canBanMembers(),
    f.canKickMembers(),
    f.canViewGuildInsights()
  );
const MOD_PERMS = f.and(
    f.canMuteMembers(),
    f.canManageMessages(),
    f.canManageRoles()
  );
const HELPER_PERMS = f.and(f.canManageMessages());
  const USER_PERMS = f.and(
    f.canSendMessages(),
    f.canEmbedLinks(),
    f.canUseExternalEmojis(),
    f.canUseVoiceActivity()
  );