import errorTracker from 'src/framework/services/errorTracker'
import publicApi from 'src/framework/services/publicApi'
import setupIframe from 'src/framework/setupIframe'
import { beacon } from 'src/service/beacon'
import { identity } from 'src/service/identity'
import tracker from 'src/service/tracker'
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

  const serviceData = { config, embeddableName: 'messenger' }

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
