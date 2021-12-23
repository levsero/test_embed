import { init, run, initIPM } from 'classicSrc/app/webWidget/boot'
import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { beacon } from '@zendesk/widget-shared-services/beacon'
import { errorTracker } from '@zendesk/widget-shared-services/errorTracker'
import { identity } from '@zendesk/widget-shared-services/identity'
import { publicApi } from '@zendesk/widget-shared-services/public-api'
import tracker from '@zendesk/widget-shared-services/tracker'
import setupIframe from 'src/framework/setupIframe'

const frameworkServices = [identity, beacon, publicApi, tracker]

const start = async (config, configLoadEnd) => {
  try {
    setupIframe()

    beacon.setConfigLoadTime(configLoadEnd)

    const rawServerLocale = config.locale
    const rawClientLocale = i18n.getClientLocale()
    const clientLocale = i18n.parseLocale(rawClientLocale)
    const serverLocale = i18n.parseLocale(rawServerLocale)

    const localeData = {
      ...config,
      rawServerLocale,
      rawClientLocale,
      clientLocale,
      serverLocale,
    }

    const serviceData = { config, embeddableName: 'webWidget', localeData }

    frameworkServices.forEach((service) => service.init?.(serviceData))
    const embeddableData = await init(serviceData)

    frameworkServices.forEach((service) => service.run?.(serviceData))
    run({ ...serviceData, embeddableData })

    beacon.sendPageView('web_widget')

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

export default {
  run,
  init: init,
  initIPM: initIPM,
  start,
}
