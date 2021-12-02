import { logAndTrackApiError } from './api/errorHandlers'
import { beacon } from './beacon'
import { errorTracker } from './errorTracker'
import isFeatureEnabled, { updateFeatures } from './feature-flags'
import { identity } from './identity'
import { logger } from './logger'
import { store as persistence } from './persistence'
import { publicApi } from './public-api'
import tracker from './tracker'
import {
  logFailure,
  resetConfig,
  getConfig,
  getDynamicHostname,
  updateConfig,
  sendWithMeta,
  send,
  buildFullUrl,
} from './transport/http/base'
import * as browser from './util/browser'
import { onBrowserComingBackOnline, onBrowserGoingOffline } from './util/browser'
import * as devices from './util/devices'
import {
  isMobileBrowser,
  clickBusterHandler,
  isSafari,
  isFirefox,
  isIE,
  getZoomSizingRatio,
  isDevice,
  isChromeOnIPad,
  setScaleLock,
} from './util/devices'
import InfiniteLoopError from './util/errors/fatal/InfiniteLoopError'
import ZopimApiError from './util/errors/nonFatal/ZopimApiError'
import {
  win,
  navigator,
  isPopout,
  location,
  document,
  focusLauncher,
  setReferrerMetas,
  getDocumentHost,
  getReferrerPolicy,
  getZendeskHost,
} from './util/globals'
import * as globals from './util/globals'
import inDebugMode from './util/in-debug-mode'
import { isOnHelpCenterPage, isOnHostMappedDomain } from './util/pages'
import {
  sha1,
  base64UrlDecode,
  base64decode,
  onNextTick,
  getPageKeywords,
  emailValid,
  nameValid,
  phoneValid,
  appendParams,
  parseUrl,
  objectDifference,
  getHostUrl,
  isValidUrl,
  getPageTitle,
} from './util/utils'

// individual services
export { beacon, errorTracker, identity, logger, persistence, publicApi, tracker }

// browser functions
export { onBrowserComingBackOnline, onBrowserGoingOffline }

// globals functions
export {
  document,
  focusLauncher,
  getDocumentHost,
  getReferrerPolicy,
  isPopout,
  location,
  navigator,
  setReferrerMetas,
  win,
}

// http functions
export {
  buildFullUrl,
  getConfig,
  getDynamicHostname,
  logFailure,
  resetConfig,
  send,
  sendWithMeta,
  updateConfig,
}

// devices functions
export {
  clickBusterHandler,
  getZoomSizingRatio,
  isChromeOnIPad,
  isDevice,
  isFirefox,
  isIE,
  isMobileBrowser,
  isSafari,
  setScaleLock,
}

// utils functions
export {
  appendParams,
  base64decode,
  base64UrlDecode,
  emailValid,
  getHostUrl,
  getPageKeywords,
  getPageTitle,
  isValidUrl,
  nameValid,
  objectDifference,
  onNextTick,
  parseUrl,
  phoneValid,
  sha1,
}

// pages functions
export { isOnHelpCenterPage, isOnHostMappedDomain }

// errors
export { InfiniteLoopError, logAndTrackApiError, ZopimApiError }

// random
export { browser, devices, getZendeskHost, globals, inDebugMode, isFeatureEnabled, updateFeatures }
