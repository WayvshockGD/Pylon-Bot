import './globals';
import './events/message';
import './events/join-leave';
import './events//logs';
import './events/roles';
import './commands/administration/kick';
import './commands/administration/ban';
import './commands/administration/broadcast';
import './commands/moderation/mute-unmute';
import './commands/fun/minesweeper';
import './commands/twitter/twitter';
import './commands/twitch/twitch';
import './commands/economy/potato';
import './commands/utility/menu';
import './commands/utility/commands';
import './commands/utility/info';
import './commands/utility/levels';
import './commands/utility/ping';

import KVManager from './kvManager';

(async () => {
  await KVManager.set('asdf', 20);
  const v = await KVManager.get('asdf');
})();
