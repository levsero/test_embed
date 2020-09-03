import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import hostPageWindow from 'src/framework/utils/hostPageWindow'
import App from 'src/apps/messenger/features/app'
import createStore from 'src/apps/messenger/store'
import { watchForScreenChanges } from 'src/apps/messenger/features/responsiveDesign/store'
import publicApi from 'src/framework/services/publicApi'
import createMessengerApi from './public-api'
import { configReceived } from 'src/apps/messenger/store/actions'

const run = ({ config }) => {
  const element = hostPageWindow.document.body.appendChild(
    hostPageWindow.document.createElement('div')
  )

  const store = createStore()
  publicApi.registerApi(createMessengerApi(store))

  store.dispatch(configReceived(config?.messenger))
  store.dispatch(watchForScreenChanges())

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
