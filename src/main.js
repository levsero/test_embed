require('./polyfills');

import { boot } from './boot';
import { logging } from 'service/logging';
import { isBlacklisted } from 'utility/devices';
import { win,
         document as doc } from 'utility/globals';

try {
  if (!isBlacklisted()) {
    // setTimeout needed for ie10. Otherwise it calls boot too early
    // and the other zE functions on the page aren't seen. This leads to
    // the pre render queue being skipped which breaks zE.hide.
    setTimeout(() => boot.start(win, doc), 0);
  }
} catch (err) {
  logging.error({
    error: err
  });
}
