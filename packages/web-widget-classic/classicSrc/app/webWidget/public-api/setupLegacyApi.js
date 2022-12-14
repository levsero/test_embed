import { displayArticle } from 'classicSrc/embeds/helpCenter/actions'
import { activateReceived, legacyShowReceived } from 'classicSrc/redux/modules/base'
import { getWidgetAlreadyHidden } from 'classicSrc/redux/modules/base/base-selectors'
import {
  hideApi,
  identifyApi,
  logoutApi,
  prefill,
  setHelpCenterSuggestionsApi,
  setLocaleApi,
} from 'classicSrc/service/api/apis'
import { renderer } from 'classicSrc/service/renderer'
import _ from 'lodash'
import { tracker } from '@zendesk/widget-shared-services'

export const getWebWidgetLegacyPublicApi = (reduxStore, embeddableConfig) => {
  const existingConfig = !_.isEmpty(embeddableConfig.embeds)

  return {
    configureIPMWidget: (config) => {
      if (!existingConfig) {
        renderer.initIPM(config, embeddableConfig, reduxStore)
      }
    },
    showIPMArticle: (articleId) => {
      reduxStore.dispatch(displayArticle(articleId))
    },
    showIPMWidget: () => {
      reduxStore.dispatch(activateReceived())
    },
    hideIPMWidget: () => {
      hideApi(reduxStore)
    },
    identify: (user) => {
      identifyApi(reduxStore, user)

      if (!user || !user.email || !user.name) return

      const prefillUser = {
        name: {
          value: user.name,
        },
        email: {
          value: user.email,
        },
      }

      prefill(reduxStore, prefillUser)
    },
    logout: () => logoutApi(reduxStore),
    setHelpCenterSuggestions: (options) => setHelpCenterSuggestionsApi(reduxStore, options),
    activate: (options) => {
      reduxStore.dispatch(activateReceived(options))
    },
    activateIpm: () => {}, // no-op until rest of connect code is removed
    hide: () => {
      tracker.track('zE.hide')
      hideApi(reduxStore)
    },
    show: () => {
      const state = reduxStore.getState()

      if (!getWidgetAlreadyHidden(state)) return
      reduxStore.dispatch(legacyShowReceived())
    },
    setLocale: (locale) => {
      tracker.track('zE.setLocale', locale)
      setLocaleApi(reduxStore, locale)
    },
  }
}
