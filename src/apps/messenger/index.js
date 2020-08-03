import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import App from 'src/apps/messenger/features/core/components/App'
import createStore from 'src/apps/messenger/store'
import { throwawayAction } from 'src/apps/messenger/store/throwaway'

const run = () => {
  const element = hostPageWindow.document.body.appendChild(
    hostPageWindow.document.createElement('div')
  )

  const store = createStore()

  store.dispatch(throwawayAction())

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