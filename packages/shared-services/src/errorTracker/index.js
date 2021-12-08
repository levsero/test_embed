import Rollbar from 'rollbar'
import { getZendeskHost } from 'src/util/globals'
import inDebugMode from 'src/util/in-debug-mode'

const getHostUrl = () => {
  const win = window.parent
  const location = win.location
  return location.toString()
}

const getSubdomain = () => {
  return getZendeskHost(document)
}

const hostAllowList = [/^.*(assets|static|static-staging)\.(zd-staging|zendesk|zdassets)\.com.*$/]

if (__DEV__) {
  hostAllowList.push('localhost', '127.0.0.1')
}

const ignoredMessagesList = [
  /^(.)*(Script error).?$/,

  /* Occurs when a request sent to the server took longer than the server's maximum wait time.
   Possible reasons include network quality, processing time on the server-side, etc. */
  'timeout of [0-9]+ms exceeded',

  // Occurs when the initial config request is prematurely ended
  'Request has been terminated\nPossible causes',

  // Occurs in safari and ios when there's no permission to play audio
  'the user denied permission',
]

let oneOutOfXAmount = 1000

export const ignoreException = (_isUncaught, _args, _payload) => {
  if (__EMBEDDABLE_FRAMEWORK_ENV__ === 'production') {
    if (inDebugMode()) return false
    // throttles error notifications so that only 1 in 1000(oneOutOfXAmount) errors are sent through to rollbar
    return Math.floor(Math.random() * oneOutOfXAmount) !== 0
  }
  return false
}

const payloadTransformer = (payload) => {
  const rollbarFingerprint = payload?.body?.trace?.extra?.rollbarFingerprint || false
  const rollbarTitle = payload?.body?.trace?.extra?.rollbarTitle || false

  if (rollbarFingerprint) payload.fingerprint = rollbarFingerprint
  if (rollbarTitle) payload.title = rollbarTitle
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
    embeddableName: 'framework',
    environment: __EMBEDDABLE_FRAMEWORK_ENV__,
    hostPageUrl: getHostUrl(),
    subdomain: getSubdomain(),
    client: {
      javascript: {
        source_map_enabled: true, // eslint-disable-line camelcase
        code_version: __EMBEDDABLE_VERSION__, // eslint-disable-line camelcase
        guess_uncaught_frames: true, // eslint-disable-line camelcase
      },
    },
  },
}

const _errorTracker = new Rollbar(rollbarConfig)

export const errorTracker = {
  configure: (...args) => {
    _errorTracker.configure(...args)
  },
  critical: (...args) => {
    _errorTracker.critical.call(_errorTracker, ...args)
  },
  error: (...args) => {
    _errorTracker.error.call(_errorTracker, ...args)
  },
  warn: (...args) => {
    _errorTracker.warning.call(_errorTracker, ...args)
  },
  info: (...args) => {
    _errorTracker.info.call(_errorTracker, ...args)
  },
  debug: (...args) => {
    _errorTracker.debug.call(_errorTracker, ...args)
  },
  logOneOutOfXErrors: (newOneOutOfXAmount) => {
    oneOutOfXAmount = newOneOutOfXAmount
  },
}
export { inDebugMode, getHostUrl, getSubdomain }
