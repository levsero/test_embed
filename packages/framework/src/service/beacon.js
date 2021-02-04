import _ from 'lodash'

import i18n from 'src/framework/services/i18n'
import { store } from 'src/framework/services/persistence'
import { sendWithMeta } from 'service/transport/http-base'
import { win, document as doc, navigator, getReferrerPolicy } from 'utility/globals'
import { isOnHelpCenterPage } from 'utility/pages'
import { nowInSeconds, parseUrl, referrerPolicyUrl, sha1 } from 'utility/utils'
import { getMetaTagsByName, isMobileBrowser } from 'utility/devices'

let configLoadTime,
  previousTime = 0

let config = {
  method: 'GET',
  endpoint: '/embeddable_blip',
  identifyEndpoint: '/embeddable_identify',
  reduceBlipping: false,
  throttleIdentify: false
}

const trackLocaleDiff = rawServerLocale => {
  const rawClientLocale = i18n.getBrowserLocale()
  const clientLocale = i18n.parseLocale(rawClientLocale)
  const serverLocale = i18n.parseLocale(rawServerLocale)

  if (clientLocale !== serverLocale) {
    const analytics = {
      value: {
        rawClientLocale,
        rawServerLocale,
        clientLocale,
        serverLocale,
        userAgent: navigator.userAgent,
        isMobile: isMobileBrowser()
      },
      action: 'localeMismatch',
      category: 'locale'
    }

    sendAnalyticsBlip(analytics)
  }
}

const sendAnalyticsBlip = data => {
  const payload = {
    type: 'analytics',
    method: config.method,
    path: config.endpoint,
    params: {
      analytics: data
    }
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
  if (config.reduceBlipping) return

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
    helpCenterDedup: isOnHelpCenterPage()
  }
  const payload = {
    type: 'pageView',
    method: config.method,
    path: config.endpoint,
    params: {
      channel,
      pageView: _.extend(pageViewParams, pageView)
    }
  }

  sendWithMeta(payload)
}

function sendWidgetInitInterval() {
  if (config.reduceBlipping) return

  const initTime = (win.zEmbed || win.zE || {}).t

  if (!initTime) return

  const time = Date.now() - initTime

  const params = {
    performance: {
      initInterval: time,
      configLoadTime: configLoadTime
    }
  }

  const payload = {
    type: 'performance',
    method: config.method,
    path: config.endpoint,
    params: params
  }

  sendWithMeta(payload)
}

function setConfig(_config) {
  _.merge(config, {
    reduceBlipping: !!_config.reduceBlipping,
    throttleIdentify: !!_config.throttleIdentify
  })
}

function init({ config, configLoadStart }) {
  previousTime = Date.now()

  beacon.setConfig(config)
  beacon.trackLocaleDiff(config.locale)
  beacon.setConfigLoadTime(Date.now() - configLoadStart)
}

function setConfigLoadTime(time) {
  configLoadTime = time
}

function trackUserAction(category, action, options) {
  if (_.isUndefined(category) || _.isUndefined(action) || config.reduceBlipping) {
    return false
  }

  const defaults = {
    label: null,
    value: null,
    channel: 'web_widget'
  }

  options = _.defaults(options, defaults)

  const userAction = {
    category: category,
    action: action,
    label: options.label,
    value: options.value
  }
  const payload = {
    type: 'userAction',
    method: config.method,
    path: config.endpoint,
    params: {
      channel: options.channel,
      userAction: userAction
    }
  }

  sendWithMeta(payload)
}

function trackSettings(settings) {
  if (!win.zESettings || _.isEmpty(settings) || config.reduceBlipping || settings.cookies === false)
    return

  const previousSettings = store.get('settings')
  const expiryTime = nowInSeconds() - 24 * 60 * 60
  const encoded = sha1(JSON.stringify(settings))
  const validSettings = _.filter(previousSettings, settings => settings[1] > expiryTime)
  const done = () => {
    validSettings.push([encoded, nowInSeconds()])
    store.set('settings', validSettings)
  }

  const payload = {
    type: 'settings',
    method: config.method,
    path: config.endpoint,
    params: { settings },
    callbacks: { done }
  }

  if (!_.find(validSettings, s => s[0] === encoded)) {
    sendWithMeta(payload)
  } else {
    // Clear any expired settings that exist from other pages
    // on the customers domain.
    store.set('settings', validSettings)
  }
}

function identify(user, localeId) {
  if (config.throttleIdentify) return

  const { method, identifyEndpoint } = config
  const payload = {
    type: 'user',
    method: method,
    path: identifyEndpoint,
    params: {
      user: { ...user, localeId },
      userAgent: navigator.userAgent
    }
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
      entry = _.find(window.performance.getEntries(), function(entry) {
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
  trackLocaleDiff
}
