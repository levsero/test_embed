import _ from 'lodash'

import { beacon } from 'service/beacon'
import { identity } from 'service/identity'
import errorTracker from 'service/errorTracker'
import { store as persistenceStore } from 'service/persistence'
import { renderer } from 'service/renderer'
import webWidgetApi from 'service/api/webWidgetApi'
import zopimApi from 'service/api/zopimApi'
import { settings } from 'service/settings'
import { http } from 'service/transport'
import { GA } from 'service/analytics/googleAnalytics'
import { clickBusterHandler, isMobileBrowser } from 'utility/devices'
import { initMobileScaling } from 'utility/mobileScaling'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import { i18n } from 'service/i18n'
import createStore from 'src/redux/createStore'
import tracker from 'service/tracker'
import { setReferrerMetas } from 'utility/globals'

const setupIframe = (iframe, doc) => {
  // Firefox has an issue with calculating computed styles from within a iframe
  // with display:none. If getComputedStyle returns null we adjust the styles on
  // the iframe so when we need to query the parent document it will work.
  // http://bugzil.la/548397
  if (getComputedStyle(doc.documentElement) === null) {
    const newStyle = 'width: 0; height: 0; border: 0; position: absolute; top: -9999px'

    iframe.removeAttribute('style')
    iframe.setAttribute('style', newStyle)
  }

  // Honour any no-referrer policies on the host page by dynamically
  // injecting the appropriate meta tags on the iframe.
  // TODO: When main.js refactor is complete, test this.
  if (iframe) {
    setReferrerMetas(iframe, doc)
  }
}

const setupServices = reduxStore => {
  settings.init(reduxStore)
  identity.init()

  errorTracker.configure({ enabled: settings.getErrorReportingEnabled() })
  GA.init()
}

const filterEmbeds = config => {
  const features = _.get(document.zendesk, 'web_widget.features')

  // If there are no features available to read, do not do filtering
  if (!features) return config
  // If talk feature isn't available, act as if talk isn't in the config
  if (!_.includes(features, 'talk') && _.has(config.embeds, 'talk')) delete config.embeds.talk
  // If chat feature isn't available, act as if chat isn't in the config
  if (!_.includes(features, 'chat') && _.has(config.embeds, 'chat')) {
    delete config.embeds.chat
  }

  return config
}

const getConfig = (win, postRenderQueue, reduxStore) => {
  if (win.zESkipWebWidget) return

  const configLoadStart = Date.now()
  const done = res => {
    const config = filterEmbeds(res.body)

    beacon.trackLocaleDiff(config.locale)

    if (config.hostMapping) {
      http.updateConfig({ hostMapping: config.hostMapping })
    }

    tracker.enable()

    reduxStore.dispatch(updateEmbeddableConfig(res.body))

    beacon.setConfig(config)

    webWidgetApi.apiSetup(win, reduxStore, config)

    beacon.setConfigLoadTime(Date.now() - configLoadStart)

    if (win.zESettings) {
      beacon.trackSettings(settings.getTrackSettings())
    }

    if (_.get(config, 'embeds.chat')) {
      zopimApi.setUpZopimApiMethods(win, reduxStore)
    }

    const renderCallback = () => {
      renderer.init(config, reduxStore)
      webWidgetApi.apisExecutePostRenderQueue(win, postRenderQueue, reduxStore)
      beacon.sendPageView()
    }

    i18n.setLocale(undefined, renderCallback, config.locale)
  }

  if (global.configRequest) {
    global.configRequest.then(config => {
      done({ body: config })
    })
    return
  }

  const embeddableConfig = persistenceStore.get('embeddableConfig')

  if (embeddableConfig) {
    done({ body: embeddableConfig })
    return
  }
  http.get(
    {
      method: 'get',
      path: '/embeddable/config',
      callbacks: {
        done
      }
    },
    false
  )
}

const shouldSendZeDiffBlip = win => {
  return win.zE !== win.zEmbed
}

const start = (win, doc) => {
  const reduxStore = createStore()
  const postRenderQueue = []
  const { publicApi } = webWidgetApi.setupLegacyApiQueue(win, postRenderQueue, reduxStore)

  i18n.init(reduxStore)
  boot.setupIframe(window.frameElement, doc)
  boot.setupServices(reduxStore)
  zopimApi.setupZopimQueue(win)

  _.extend(win.zEmbed, publicApi)

  webWidgetApi.apisExecuteQueue(reduxStore, document.zEQueue)

  beacon.init()
  win.onunload = identity.unload

  webWidgetApi.legacyApiSetup(win, reduxStore)

  boot.getConfig(win, postRenderQueue, reduxStore)

  if (shouldSendZeDiffBlip(win)) {
    beacon.trackUserAction('zEmbedFallback', 'warning')
  }

  if (isMobileBrowser()) {
    initMobileScaling()

    win.addEventListener('click', clickBusterHandler, true)
  }
}

export const boot = {
  start,

  // Exported for testing only.
  setupIframe,
  setupServices,
  getConfig
}
