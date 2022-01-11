import _ from 'lodash'
import isFeatureEnabled, { updateFeatures } from 'src/feature-flags'
import { store } from 'src/persistence'
import { sendWithMeta } from 'src/transport/http/base'
import { isMobileBrowser, getMetaTagsByName } from 'src/util/devices'
import { win, document as doc, navigator, getReferrerPolicy } from 'src/util/globals'
import { isOnHelpCenterPage } from 'src/util/pages'
import { parseUrl, referrerPolicyUrl, sha1 } from 'src/util/utils'

let configLoadTime,
  previousTime = 0

let config = {
  method: 'GET',
  endpoint: '/embeddable_blip',
  identifyEndpoint: '/embeddable_identify',
  reduceBlipping: false,
  throttleIdentify: false,
}

const trackLocaleDiff = ({ rawServerLocale, rawClientLocale, clientLocale, serverLocale }) => {
  if (clientLocale !== serverLocale) {
    const analytics = {
      value: {
        rawClientLocale,
        rawServerLocale,
        clientLocale,
        serverLocale,
        userAgent: navigator.userAgent,
        isMobile: isMobileBrowser(),
      },
      action: 'localeMismatch',
      category: 'locale',
    }

    sendAnalyticsBlip(analytics)
  }
}

const sendAnalyticsBlip = (data) => {
  const payload = {
    type: 'analytics',
    method: config.method,
    path: config.endpoint,
    params: {
      analytics: data,
    },
  }

  sendWithMeta(payload)
}

const sendPageViewWhenReady = (channel = 'web_widget') => {
  // We need to invoke `sendPageView` on `DOMContentLoaded` because
  // for help center host pages, the script that defines the `HelpCenter`
  // global object may not be executed yet.
  // DOMContentLoaded: https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
  if (doc.readyState !== 'complete' && doc.readyState !== 'interactive') {
    doc.addEventListener(
      'DOMContentLoaded',
      () => {
        sendPageView(channel)
      },
      false
    )
  } else {
    sendPageView(channel)
  }
}

const sendPageView = (channel = 'web_widget') => {
  if (isFeatureEnabled('web_widget_reduce_blipping')) return

  const now = Date.now()
  const referrer = parseUrl(doc.referrer)
  const url = win.location.origin
  const timeOnLastPage = () => {
    return referrer.origin === url && previousTime ? now - previousTime : 0
  }
  const referrerUrl = getReferrerPolicy()
    ? referrerPolicyUrl(getReferrerPolicy(), referrer.href)
    : referrer.href
  const pageViewParams = referrerUrl ? { referrer: referrerUrl } : {}
  const frameworkLoadTime = getFrameworkLoadTime()
  const metaTag = getMetaTagsByName(doc, 'viewport')[0]

  const pageView = {
    time: timeOnLastPage(),
    loadTime: frameworkLoadTime,
    navigatorLanguage: navigator.language,
    pageTitle: doc.title,
    userAgent: navigator.userAgent,
    isMobile: isMobileBrowser(),
    isResponsive: Boolean(metaTag),
    viewportMeta: metaTag ? metaTag.getAttribute('content') : '',
    helpCenterDedup: isOnHelpCenterPage(),
  }
  const payload = {
    type: 'pageView',
    method: config.method,
    path: config.endpoint,
    params: {
      channel,
      pageView: _.extend(pageViewParams, pageView),
    },
  }

  sendWithMeta(payload)
}

function sendWidgetInitInterval() {
  if (isFeatureEnabled('web_widget_reduce_blipping')) return

  const initTime = (win.zEmbed || win.zE || {}).t

  if (!initTime) return

  const time = Date.now() - initTime

  const params = {
    performance: {
      initInterval: time,
      configLoadTime: configLoadTime,
    },
  }

  const payload = {
    type: 'performance',
    method: config.method,
    path: config.endpoint,
    params: params,
  }

  sendWithMeta(payload)
}

function setConfig(_config) {
  _.merge(config, {
    reduceBlipping: isFeatureEnabled('web_widget_reduce_blipping'),
    throttleIdentify: isFeatureEnabled('web_widget_throttle_identify'),
  })
}

function init({ config, localeData }) {
  previousTime = Date.now()

  updateFeatures(config.features)
  beacon.setConfig(config)
  beacon.trackLocaleDiff(localeData)
}

function setConfigLoadTime(time) {
  configLoadTime = time
}

function canSendApiUserActionBlips() {
  if (store.sessionStorageGet('sendApiBlips') !== null) {
    return Boolean(store.sessionStorageGet('sendApiBlips'))
  }

  const isRandomlyTrue = () => {
    const oneOutOfXAmount = 1000
    return Math.floor(Math.random() * oneOutOfXAmount) === 0
  }

  if (isRandomlyTrue()) {
    store.sessionStorageSet('sendApiBlips', true)
  }

  return Boolean(store.sessionStorageGet('sendApiBlips'))
}

function trackUserAction(category, action, options) {
  if (
    _.isUndefined(category) ||
    _.isUndefined(action) ||
    isFeatureEnabled('web_widget_reduce_blipping')
  ) {
    return false
  }

  if (category === 'api' && !canSendApiUserActionBlips()) {
    return false
  }

  const defaults = {
    label: null,
    value: null,
    channel: 'web_widget',
  }

  options = _.defaults(options, defaults)

  const userAction = {
    category: category,
    action: action,
    label: options.label,
    value: options.value,
  }
  const payload = {
    type: 'userAction',
    method: config.method,
    path: config.endpoint,
    params: {
      channel: options.channel,
      userAction: userAction,
    },
  }

  sendWithMeta(payload)
}

function trackSettings(settings) {
  if (
    !win.zESettings ||
    _.isEmpty(settings) ||
    isFeatureEnabled('web_widget_reduce_blipping') ||
    settings.cookies === false
  )
    return

  const nowInSeconds = Math.floor(Date.now() / 1000)

  const previousSettings = store.get('settings')
  const expiryTime = nowInSeconds - 24 * 60 * 60
  const encoded = sha1(JSON.stringify(settings))
  const validSettings = _.filter(previousSettings, (settings) => settings[1] > expiryTime)
  const done = () => {
    validSettings.push([encoded, nowInSeconds])
    store.set('settings', validSettings)
  }

  const payload = {
    type: 'settings',
    method: config.method,
    path: config.endpoint,
    params: { settings },
    callbacks: { done },
  }

  if (!_.find(validSettings, (s) => s[0] === encoded)) {
    sendWithMeta(payload)
  } else {
    // Clear any expired settings that exist from other pages
    // on the customers domain.
    store.set('settings', validSettings)
  }
}

function identify(user, localeId) {
  if (isFeatureEnabled('web_widget_throttle_identify')) return

  const { method, identifyEndpoint } = config
  const payload = {
    type: 'user',
    method: method,
    path: identifyEndpoint,
    params: {
      user: { ...user, localeId },
      userAgent: navigator.userAgent,
    },
  }

  sendWithMeta(payload)
}

function isEntryTrackedScript(entry) {
  const name = entry.name

  return name.indexOf('main.js') !== -1 || name.indexOf('web_widget/latest/') !== -1
}

function getFrameworkLoadTime() {
  let entry
  const now = Date.now()
  const initTime = (win.zEmbed || win.zE || {}).t

  if (!initTime) return null

  let loadTime = now - initTime

  // https://bugzilla.mozilla.org/show_bug.cgi?id=1045096
  try {
    if ('performance' in window && 'getEntries' in window.performance) {
      entry = _.find(window.performance.getEntries(), function (entry) {
        return isEntryTrackedScript(entry)
      })

      if (entry && entry.duration) {
        loadTime = entry.duration
      }
    }
  } catch (e) {}

  return loadTime >= 0 ? loadTime : undefined
}

export const beacon = {
  init,
  trackUserAction,
  trackSettings,
  identify,
  setConfigLoadTime,
  getFrameworkLoadTime,
  sendPageView: sendPageViewWhenReady,
  setConfig,
  sendWidgetInitInterval,
  trackLocaleDiff,
}

window.beacon = beacon
