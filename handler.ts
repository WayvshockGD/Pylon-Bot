import './globals';
import './events/message';
import './events/join-leave';
import './commands/administration/kick';
import './commands/administration/ban';
import './commands/administration/broadcast';
import './commands/moderation/mute-unmute';
import './commands/moderation/announce';
import './commands/twitter/twitter';
import './commands/utility/levels';
import './commands/utility/ping';
import './commands/utility/info';
import './commands/utility/menu';
import './commands/utility/commands';
import './commands/economy/economy';
import './commands/economy/xp';

import KVManager from './kvManager';

(async () => {
  await KVManager.set('asdf', 20);
  const v = await KVManager.get('asdf');
})();
