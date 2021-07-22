import { fetchEmbeddableConfig } from 'src/framework/api/embeddableConfig'
import errorTracker from 'src/framework/services/errorTracker'
import publicApi from 'src/framework/services/publicApi'
import { beacon } from 'src/service/beacon'
import { identity } from 'src/service/identity'
import tracker from 'src/service/tracker'
import { isBlacklisted } from 'utility/devices'
import { setReferrerMetas, win, document as doc } from 'utility/globals'
import './polyfills'

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

const embeddables = {
  messenger: () =>
    import(/* webpackChunkName: "messenger" */ 'src/apps/messenger').then(
      (messenger) => messenger.default
    ),
  webWidget: () =>
    import(/* webpackChunkName: "lazy/web_widget" */ 'src/apps/webWidget').then(
      (webWidget) => webWidget.default
    ),
}

const frameworkServices = [identity, beacon, publicApi, tracker]

const start = async () => {
  try {
    if (isBlacklisted()) {
      return
    }

    if (win.zESkipWebWidget) {
      return
    }

    framework.setupIframe(window.frameElement, doc)

    const configLoadStart = Date.now()
    const config = await fetchEmbeddableConfig()
    beacon.setConfigLoadTime(Date.now() - configLoadStart)

    // Load the embeddable
    const embeddableName = config.messenger ? 'messenger' : 'webWidget'
    const embeddable = await embeddables[embeddableName]()
    errorTracker.configure({
      payload: {
        embeddableName: embeddableName,
        environment: `${embeddableName}-${__EMBEDDABLE_FRAMEWORK_ENV__}`,
      },
    })

    const serviceData = { config, embeddableName }

    // Initialise all framework services and then initialise the embeddable
    frameworkServices.forEach((service) => service.init?.(serviceData))
    const embeddableData = await embeddable.init?.(serviceData)

    // Start running all framework services and then start running the embeddable
    frameworkServices.forEach((service) => service.run?.(serviceData))
    embeddable.run?.({ ...serviceData, embeddableData })

    beacon.sendPageView(embeddableName === 'messenger' ? 'web_messenger' : 'web_widget')

    if (Math.random() <= 0.1) {
      beacon.sendWidgetInitInterval()
    }
  } catch (err) {
    errorTracker.error(err, {
      rollbarFingerprint: 'Failed to render embeddable',
      rollbarTitle: 'Failed to render embeddable',
    })
  }
}

const framework = {
  start,

  // Exported for testing only.
  setupIframe,
}

export default framework
