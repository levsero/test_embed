import 'core-js/modules/es.promise'
import 'core-js/modules/es.set'
import 'core-js/modules/es.array.iterator'
import 'core-js/modules/es.array.find'
import 'core-js/modules/es.string.starts-with'
import 'core-js/modules/es.array.includes'
import 'core-js/modules/es.object.entries'

import { boot } from './boot'
import errorTracker from 'src/framework/services/errorTracker'
import { isBlacklisted } from 'utility/devices'
import { win, document as doc } from 'utility/globals'
import { onNextTick } from 'src/util/utils'

try {
  if (!isBlacklisted()) {
    // Needed for ie10. Otherwise it calls boot too early
    // and the other zE functions on the page aren't seen. This leads to
    // the pre render queue being skipped which breaks zE.hide.
    onNextTick(() => boot.start(win, doc))
  }
} catch (err) {
  errorTracker.error(err)
}
