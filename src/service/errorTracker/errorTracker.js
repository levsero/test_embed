import Rollbar from 'rollbar'
import logger from 'utility/logger'
import { inDebugMode } from 'utility/runtime'
import ConsoleError from 'errors/ConsoleError'
import { getHostUrl } from 'src/util/utils'

const hostAllowList = [/^.*(assets|static|static-staging)\.(zd-staging|zendesk|zdassets)\.com.*$/]

if (__DEV__) {
  hostAllowList.push('localhost', '127.0.0.1')
}

const ignoredMessagesList = [/^(.)*(Script error).?$/]

export const ignoreException = (_isUncaught, _args, _payload) => {
  if (__EMBEDDABLE_FRAMEWORK_ENV__ === 'production') {
    // throttles error notifications so that only 1 in 1000 errors is sent through to rollbar
    return Math.floor(Math.random() * 1000) !== 0
  }
  return false
}

const rollbarConfig = {
  enabled: true,
  accessToken: '94eb0137fdc14471b21b34c5a04f9359',
  captureUncaught: true,
  captureUnhandledRejections: true,
  checkIgnore: ignoreException,
  ignoredMessages: ignoredMessagesList,
  endpoint: 'https://rollbar-eu.zendesk.com/api/1/item/',
  hostWhitelist: hostAllowList,
  maxItems: 10,
  payload: {
    environment: __EMBEDDABLE_FRAMEWORK_ENV__,
    hostPageUrl: getHostUrl(),
    client: {
      javascript: {
        source_map_enabled: true, // eslint-disable-line camelcase
        code_version: __EMBEDDABLE_VERSION__, // eslint-disable-line camelcase
        guess_uncaught_frames: true // eslint-disable-line camelcase
      }
    }
  }
}

const errorTracker = new Rollbar(rollbarConfig)

const errorHandler = (error, ...args) => {
  if (inDebugMode() || (error && error instanceof ConsoleError)) {
    logger.error(error, ...args)
  }
  errorTracker.error(error, ...args)
}

export default {
  configure: (...args) => {
    errorTracker.configure(...args)
  },
  error: errorHandler
}
