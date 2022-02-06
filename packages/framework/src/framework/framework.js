import { errorTracker } from '@zendesk/widget-shared-services/errorTracker'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'
import { fetchEmbeddableConfig } from 'src/framework/api/embeddableConfig'
import { isBlacklisted } from 'src/framework/isBlacklisted'

global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WW_I18N'

const start = async () => {
  try {
    if (isBlacklisted()) {
      return
    }

    if (window.parent.zESkipWebWidget) {
      return
    }

    const configLoadStart = Date.now()
    const config = await fetchEmbeddableConfig()
    const configLoadEnd = Date.now() - configLoadStart
    const embeddableName = config.messenger ? 'messenger' : 'webWidget'

    errorTracker.configure({
      payload: {
        embeddableName: embeddableName,
        environment: `${embeddableName}-${__EMBEDDABLE_FRAMEWORK_ENV__}`,
      },
    })

    // Load the embeddable

    if (config.messenger) {
      if (isFeatureEnabled(null, 'module_federation')) {
        await import('webWidgetMessenger').then((messenger) =>
          messenger.default.start(config, configLoadEnd)
        )
      } else {
        await import(
          /* webpackChunkName: "messenger" */ '@zendesk/web-widget-messenger'
        ).then((messenger) => messenger.default.start(config, configLoadEnd))
      }
    } else {
      await import(
        /* webpackChunkName: "lazy/web_widget" */ '@zendesk/web-widget-classic'
      ).then((webWidget) => webWidget.default.start(config, configLoadEnd))
    }
  } catch (err) {
    errorTracker.error(err)
  }
}

const framework = {
  start,
}

export default framework
