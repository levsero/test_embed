import { errorTracker } from '@zendesk/widget-shared-services'
import { identity, publicApi, tracker } from '@zendesk/widget-shared-services'
import { beacon } from '@zendesk/widget-shared-services/beacon'
import i18n from 'src/framework/services/i18n'
import setupIframe from 'src/framework/setupIframe'
import { init, run } from 'messengerSrc/boot'

const frameworkServices = [identity, beacon, publicApi, tracker]

const start = async (config, configLoadEnd) => {
  setupIframe()

  beacon.setConfigLoadTime(configLoadEnd)

  errorTracker.configure({
    payload: {
      embeddableName: 'messenger',
      environment: `messenger-${__EMBEDDABLE_FRAMEWORK_ENV__}`,
    },
  })

  const rawServerLocale = config.locale
  const rawClientLocale = i18n.getBrowserLocale()
  const clientLocale = i18n.parseLocale(rawClientLocale)
  const serverLocale = i18n.parseLocale(rawServerLocale)

  const localeData = {
    ...config,
    rawServerLocale,
    rawClientLocale,
    clientLocale,
    serverLocale,
  }

  const serviceData = { config, embeddableName: 'messenger', localeData }

  frameworkServices.forEach((service) => service.init?.(serviceData))
  const embeddableData = await init(serviceData)

  frameworkServices.forEach((service) => service.run?.(serviceData))
  run({ ...serviceData, embeddableData })

  beacon.sendPageView('web_messenger')

  if (Math.random() <= 0.1) {
    beacon.sendWidgetInitInterval()
  }
}

export default { init, run, start }
