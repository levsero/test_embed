import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { document, getDocumentHost } from '@zendesk/widget-shared-services'
import WebWidget from 'src/embeds/webWidget/components/WebWidget'
import history from 'src/service/history'

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
