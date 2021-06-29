import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import hostPageWindow from 'src/framework/utils/hostPageWindow'
import App from 'src/apps/messenger/features/app'
import createStore from 'src/apps/messenger/store'
import { watchForScreenChanges } from 'src/apps/messenger/features/responsiveDesign/store'
import { hasExistingConversation, setupSuncoClient } from 'src/apps/messenger/api/sunco'
import { fetchExistingConversation } from 'src/apps/messenger/features/suncoConversation/store'
import { listenForOnlineOfflineEvents } from 'src/apps/messenger/features/onlineStatus/store'
import publicApi from 'src/framework/services/publicApi'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { store as persistence } from 'src/framework/services/persistence'
import { initialiseLauncherLabel } from 'src/apps/messenger/features/launcherLabel/store/visibility'
import createMessengerApi from './public-api'
import { subscribeToI18n } from 'src/apps/messenger/features/i18n/store'
import isFeatureEnabled from 'embeds/webWidget/selectors/feature-flags'
import errorTracker from 'src/framework/services/errorTracker'
import { fetchIntegrations } from 'src/apps/messenger/store/integrations'

const init = async ({ config }) => {
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

  store.dispatch(messengerConfigReceived(config?.messenger))
  store.dispatch(watchForScreenChanges())
  store.dispatch(initialiseLauncherLabel())

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

    if (isFeatureEnabled(config, 'web_widget_channel_linking')) {
      store.dispatch(fetchIntegrations())
    }

    if (hasExistingConversation()) {
      store.dispatch(fetchExistingConversation())
    }
  }

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    element,
    messengerReadyCallback
  )
}

export default {
  init,
  run,
}
