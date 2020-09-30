import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import hostPageWindow from 'src/framework/utils/hostPageWindow'
import App from 'src/apps/messenger/features/app'
import { createClient } from './suncoClient'
import createStore from 'src/apps/messenger/store'
import { watchForScreenChanges } from 'src/apps/messenger/features/responsiveDesign/store'
import publicApi from 'src/framework/services/publicApi'
import createMessengerApi from './public-api'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { messageReceived } from 'src/apps/messenger/features/messageLog/store'

const run = ({ config }) => {
  const element = hostPageWindow.document.body.appendChild(
    hostPageWindow.document.createElement('div')
  )

  const store = createStore()
  publicApi.registerApi(createMessengerApi(store))

  store.dispatch(messengerConfigReceived(config?.messenger))
  store.dispatch(watchForScreenChanges())

  // setup Sunco client
  const { integrationId, appId, baseUrl, conversationHistory } = config.messenger
  const storageType = conversationHistory === 'remember' ? 'localStorage' : 'sessionStorage'
  const client = createClient({ integrationId, appId, baseUrl, storageType })
  client.startConversation().then(conversation => {
    if (__DEV__) {
      /* eslint no-console:0 */
      console.log(`appId: ${appId}  conversationId: ${conversation.conversationId}`)
    }

    // subscribe to socket events to listen for live changes
    conversation.socketClient.subscribe(event => {
      if (event.message) {
        if (client.wasMessageSentFromThisTab(event.message)) {
          return
        }

        store.dispatch(messageReceived({ message: event.message }))
      }
    })
  })

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    element
  )
}

export default {
  run
}
