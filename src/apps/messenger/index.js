import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import hostPageWindow from 'src/framework/utils/hostPageWindow'
import App from 'src/apps/messenger/features/app'
import createStore from 'src/apps/messenger/store'
import { watchForScreenChanges } from 'src/apps/messenger/features/responsiveDesign/store'
import { hasExistingConversation, setupSuncoClient } from 'src/apps/messenger/api/sunco'
import { fetchExistingConversation } from 'src/apps/messenger/features/suncoConversation/store'
import { listenForOnlineOfflineEvents } from 'src/apps/messenger/features/connectionStatus/store'
import publicApi from 'src/framework/services/publicApi'
import createMessengerApi from './public-api'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

const run = ({ config }) => {
  const element = hostPageWindow.document.body.appendChild(
    hostPageWindow.document.createElement('div')
  )

  const store = createStore()
  publicApi.registerApi(createMessengerApi(store))

  store.dispatch(messengerConfigReceived(config?.messenger))
  store.dispatch(watchForScreenChanges())

  setupSuncoClient(config.messenger)

  const messengerReadyCallback = () => {
    listenForOnlineOfflineEvents(store)

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
  run
}
