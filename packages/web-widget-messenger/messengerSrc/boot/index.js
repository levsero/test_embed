import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { publicApi, persistence, win } from '@zendesk/widget-shared-services'
import { errorTracker } from '@zendesk/widget-shared-services/errorTracker'
import { identity } from '@zendesk/widget-shared-services/identity'
import isFeatureEnabled, { updateFeatures } from 'src/embeds/webWidget/selectors/feature-flags'
import { hasExistingConversation, setupSuncoClient } from 'messengerSrc/api/sunco'
import App from 'messengerSrc/features/app'
import { subscribeToI18n } from 'messengerSrc/features/i18n/store'
import { initialiseLauncherLabel } from 'messengerSrc/features/launcherLabel/store/visibility'
import { listenForOnlineOfflineEvents } from 'messengerSrc/features/onlineStatus/store'
import { watchForScreenChanges } from 'messengerSrc/features/responsiveDesign/store'
import { startConversation } from 'messengerSrc/features/suncoConversation/store'
import createMessengerApi from 'messengerSrc/public-api'
import createStore from 'messengerSrc/store'
import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { fetchIntegrations } from 'messengerSrc/store/integrations'
import trackNoMessageReceived from 'messengerSrc/utils/trackNoMessageReceived'

const init = async ({ config }) => {
  if (__DEV__) {
    if (isFeatureEnabled(undefined, 'dev_override_sunco')) {
      config.messenger.appId = window.top.dashboardConfig.customSunco.appId
      config.messenger.integrationId = window.top.dashboardConfig.customSunco.integrationId
    }
  }

  updateFeatures(config.features)

  if (isFeatureEnabled(config, 'log_all_messenger_errors')) {
    errorTracker.logOneOutOfXErrors(1)
  }
  if (config?.messenger?.conversationHistory === 'remember') {
    const success = persistence.enableLocalStorage()

    if (!success) {
      // Fallback to session storage if local storage isn't available
      persistence.enableSessionStorage()
    }
  } else {
    persistence.enableSessionStorage()
  }

  const store = createStore()

  const i18nResult = await store.dispatch(subscribeToI18n())

  if (i18nResult?.success !== true) {
    throw new Error('Failed to setup i18n')
  }

  publicApi.registerApi(createMessengerApi(store))

  store.dispatch(messengerConfigReceived(config.messenger))
  store.dispatch(watchForScreenChanges())
  store.dispatch(initialiseLauncherLabel())
  trackNoMessageReceived(store)

  const suncoClient = setupSuncoClient(config.messenger)
  const clientId = suncoClient.getClientId()

  if (clientId !== identity.getBuid()) {
    identity.setBuid(clientId)
  }

  if (__DEV__) {
    if (isFeatureEnabled(undefined, 'web_widget_jwt_auth')) {
      suncoClient.loginUser(async (callback) => {
        const { jwt } = await fetch(
          `http://localhost:1338/api/account/messenger-jwt/${window.top.dashboardConfig.id}`
        ).then((res) => res.json())

        callback(jwt)
      })
    }
  }

  return {
    store,
  }
}

const run = async ({ config, embeddableData }) => {
  const { store } = embeddableData

  const element = win.document.body.appendChild(win.document.createElement('div'))

  const messengerReadyCallback = () => {
    listenForOnlineOfflineEvents(store)
    if (config.messenger.channelLinkingEnabled) {
      store.dispatch(fetchIntegrations())
    }

    if (hasExistingConversation()) {
      store.dispatch(startConversation())
    }
  }

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>,
    element,
    messengerReadyCallback
  )
}

export { init, run }
