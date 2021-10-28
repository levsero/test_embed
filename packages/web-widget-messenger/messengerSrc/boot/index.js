import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import isFeatureEnabled, { updateFeatures } from 'src/embeds/webWidget/selectors/feature-flags'
import errorTracker from 'src/framework/services/errorTracker'
import { store as persistence } from 'src/framework/services/persistence'
import publicApi from 'src/framework/services/publicApi'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import { identity } from 'src/service/identity'
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
  const clientId = suncoClient.getClientId(config.messenger.integrationId)

  if (clientId !== identity.getBuid()) {
    identity.setBuid(clientId)
  }

  return {
    store,
  }
}

const run = async ({ config, embeddableData }) => {
  const { store } = embeddableData

  const element = hostPageWindow.document.body.appendChild(
    hostPageWindow.document.createElement('div')
  )

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
