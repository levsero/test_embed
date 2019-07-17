import _ from 'lodash'
import Rollbar from 'rollbar'

import { isIE } from 'utility/devices'
import { rollbarConfig } from './config'
import { getHostUrl } from 'src/util/utils'

let rollbar
let useRollbar = false
let errorServiceInitialised = false

function init(errorReportingEnabled = true) {
  if (errorReportingEnabled) {
    useRollbar = !isIE()

    if (useRollbar) {
      rollbar = Rollbar.init(rollbarConfig)
      errorServiceInitialised = true
    }
  }
}

function error(err, customData = {}) {
  if (__DEV__) {
    console.error(err) // eslint-disable-line no-console
    return
  }

  if (_.get(err, 'error.special')) {
    throw err.error.message
  } else if (errorServiceInitialised) {
    customData.hostPageUrl = getHostUrl()
    pushError(err, customData)
  }
}

function pushError(err, customData) {
  if (useRollbar) {
    rollbar.error(err, customData)
  }
}

export function setInitialise(initialise) {
  errorServiceInitialised = initialise
}
export const logging = {
  init,
  error
}
