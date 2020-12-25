import './events/message';
import './events/join-leave';
import './commands/administration/kick';
import './commands/administration/ban';
import './commands/administration/broadcast';
import './commands/moderation/mute-unmute';
import './commands/moderation/announce';
import './commands/helper/ping';
import './commands/social/twitter';
import './commands/utility/levels';
import './commands/utility/info';
import './commands/utility/menu';
import './commands/economy/ezmoney';

import KVManager from './kvManager';

(async () => {
  await KVManager.set('asdf', 20);
  const v = await KVManager.get('asdf');
})();
