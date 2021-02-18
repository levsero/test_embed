import React from 'react'
import ReactDOM from 'react-dom'
import { document, getDocumentHost } from 'utility/globals'
import { Provider } from 'react-redux'
import WebWidget from 'embeds/webWidget/components/WebWidget'
import history from 'service/history'
import { Router } from 'react-router-dom'

const render = ({ reduxStore, config }) => {
  const element = getDocumentHost().appendChild(document.createElement('div'))

  ReactDOM.render(
    <Provider store={reduxStore}>
      <Router history={history}>
        <WebWidget config={config} />
      </Router>
    </Provider>,
    element
  )
}

export default {
  render,
}
