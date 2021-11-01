import { init, run, initIPM } from 'src/apps/webWidget/boot'
import 'src/framework/polyfills'
import errorTracker from 'src/framework/services/errorTracker'
import publicApi from 'src/framework/services/publicApi'
import setupIframe from 'src/framework/setupIframe'
import { beacon } from 'src/service/beacon'
import { identity } from 'src/service/identity'
import tracker from 'src/service/tracker'

const frameworkServices = [identity, beacon, publicApi, tracker]

const start = async (config, configLoadEnd) => {
  try {
    setupIframe()

    beacon.setConfigLoadTime(configLoadEnd)

    const serviceData = { config, embeddableName: 'webWidget' }

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
