import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { hasExistingConversation, setupSuncoClient } from 'src/apps/messenger/api/sunco'
import App from 'src/apps/messenger/features/app'
import { subscribeToI18n } from 'src/apps/messenger/features/i18n/store'
import { initialiseLauncherLabel } from 'src/apps/messenger/features/launcherLabel/store/visibility'
import { listenForOnlineOfflineEvents } from 'src/apps/messenger/features/onlineStatus/store'
import { watchForScreenChanges } from 'src/apps/messenger/features/responsiveDesign/store'
import { startConversation } from 'src/apps/messenger/features/suncoConversation/store'
import createStore from 'src/apps/messenger/store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { fetchIntegrations } from 'src/apps/messenger/store/integrations'
import trackNoMessageReceived from 'src/apps/messenger/utils/trackNoMessageReceived'
import isFeatureEnabled, { updateFeatures } from 'src/embeds/webWidget/selectors/feature-flags'
import errorTracker from 'src/framework/services/errorTracker'
import { store as persistence } from 'src/framework/services/persistence'
import publicApi from 'src/framework/services/publicApi'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import createMessengerApi from './public-api'

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

  setupSuncoClient(config.messenger)

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

export default {
  init,
  run,
}
