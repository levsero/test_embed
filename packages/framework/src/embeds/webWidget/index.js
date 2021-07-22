import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import history from 'service/history'
import WebWidget from 'src/embeds/webWidget/components/WebWidget'
import { document, getDocumentHost } from 'utility/globals'

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
