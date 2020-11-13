let f = discord.command.filters;

// api TOKENs
global.FAPI_TOKEN = '';
global.TWITTER_API = '';

// bearer TOKENs
global.TWITTER_BEARER = '';

// role IDs
global.ADMIN_ROLE = '';
global.MUTE_ROLE = '';

// icon URLs
global.TWITTER_ICON = 'https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png';
global.TWITCH_ICON = 'https://cdn0.iconfinder.com/data/icons/brands-flat-2/200/twitch-social-network-brand-logo-256.png';

// channel IDs
global.JOIN_LEAVE_CHANNEL = '';

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
global.HELPER_PERMS = f.and(
    f.canManageMessages()
    );
global.USER_PERMS = f.and(
    f.canSendMessages(),
    f.canEmbedLinks(),
    f.canUseExternalEmojis(),
    f.canUseVoiceActivity()
);
