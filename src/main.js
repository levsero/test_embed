import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.set'
import 'core-js/modules/es6.array.iterator'
import 'core-js/modules/es6.array.find'
import 'core-js/modules/es7.array.includes'
import 'core-js/modules/es7.object.entries'
import './util/dev'
import { boot } from './boot'
import errorTracker from 'service/errorTracker'
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
