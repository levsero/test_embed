import 'core-js/modules/es.promise'
import 'core-js/modules/es.set'
import 'core-js/modules/es.array.iterator'
import 'core-js/modules/es.array.find'
import 'core-js/modules/es.string.starts-with'
import 'core-js/modules/es.array.includes'
import 'core-js/modules/es.object.entries'

import errorTracker from 'src/framework/services/errorTracker'
import { isBlacklisted } from 'utility/devices'
import { win, document as doc } from 'utility/globals'
import framework from './framework'

try {
  if (!isBlacklisted()) {
    framework.start(win, doc)
  }
} catch (err) {
  errorTracker.error(err)
}
