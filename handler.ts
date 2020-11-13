import './globals';
import './evernts/message';
import './events/userjoin';
import './events//logs';
import './events/roles';
import './commands/administration/kick';
import './commands/administration/band';
import './commands/administration/broadcast';
import './commands/administration/mute-unmute';
import './commands/fun/minesweeper';
import './commands/twitter/twitter';
import './commands/twitch/twitch';
import './commands/economy/potato';
import './commands/support/help';

import KVManager from './kvManager';

(async () => {
  await KVManager.set('asdf', 20);
  const v = await KVManager.get('asdf');
})();
