import WebWidget from 'classicSrc/embeds/webWidget/components/WebWidget'
import history from 'classicSrc/service/history'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { document, getDocumentHost } from '@zendesk/widget-shared-services'

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
