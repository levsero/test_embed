import Rollbar from 'rollbar'
import _get from 'lodash/get'
import { inDebugMode } from 'utility/runtime'
import { getHostUrl } from 'src/util/utils'

const hostAllowList = [/^.*(assets|static|static-staging)\.(zd-staging|zendesk|zdassets)\.com.*$/]

if (__DEV__) {
  hostAllowList.push('localhost', '127.0.0.1')
}

const groupErrorClasses = {
  ZEApiError: {
    rollbarFingerprint: 'zE API user errors',
    rollbarErrorTitle: 'Custom zE() API user error'
  },
  ZopimApiError: {
    rollbarFingerprint: '$zopim API user errors',
    rollbarErrorTitle: 'Custom $zopim() API user error'
  },
  LegacyApiError: {
    rollbarFingerprint: 'legacy API user errors',
    rollbarErrorTitle: 'Custom legacy API user error'
  }
}

const ignoredMessagesList = [
  /^(.)*(Script error).?$/,

  /* Occurs when a request sent to the server took longer than the server's maximum wait time.
   Possible reasons include network quality, processing time on the server-side, etc. */
  'timeout of [0-9]+ms exceeded',

  // Occurs when the initial config request is prematurely ended
  'Request has been terminated Possible causes',

  // Occurs in safari and ios when there's no permission to play audio
  'the user denied permission'
]

export const ignoreException = (_isUncaught, _args, _payload) => {
  if (__EMBEDDABLE_FRAMEWORK_ENV__ === 'production') {
    if (inDebugMode()) return false
    // throttles error notifications so that only 1 in 1000 errors are sent through to rollbar
    return Math.floor(Math.random() * 1000) !== 0
  }
  return false
}

const payloadTransformer = payload => {
  const exceptionClassName = _get(payload, 'body.trace.exception.class', false)

  if (groupErrorClasses.hasOwnProperty(exceptionClassName)) {
    payload.fingerprint = groupErrorClasses[exceptionClassName].rollbarFingerprint
    payload.title = groupErrorClasses[exceptionClassName].rollbarErrorTitle
  }
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
  transform: payloadTransformer,
  verbose: inDebugMode(),
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

export default {
  configure: (...args) => {
    errorTracker.configure(...args)
  },
  critical: (...args) => {
    errorTracker.critical.call(errorTracker, ...args)
  },
  error: (...args) => {
    errorTracker.error.call(errorTracker, ...args)
  },
  warn: (...args) => {
    errorTracker.warning.call(errorTracker, ...args)
  },
  info: (...args) => {
    errorTracker.info.call(errorTracker, ...args)
  },
  debug: (...args) => {
    errorTracker.debug.call(errorTracker, ...args)
  }
}
