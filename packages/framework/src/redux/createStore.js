import { createStore, compose, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { inDebugMode } from '@zendesk/widget-shared-services'
import { trackAnalytics } from 'src/redux/middleware/analytics'
import { sendBlips } from 'src/redux/middleware/blip'
import onStateChangeFn from 'src/redux/middleware/onStateChange/onStateChange'
import onStateChangeWrapper from 'src/redux/middleware/onStateChange/wrapper'
import persist from 'src/redux/middleware/persist'
import preventLoops from 'src/redux/middleware/preventLoops'
import queueCalls from 'src/redux/middleware/queue'
import resetActiveEmbed from 'src/redux/middleware/resetActiveEmbed'
import throttle from 'src/redux/middleware/throttle'
import reducer from 'src/redux/modules/reducer'

const reduxConsoleLogger = (storeName) => {
  return createLogger({
    collapsed: true,
    titleFormatter: (action) => [`${storeName}`, `%c${String(action.type)}`, '%c'].join(' '),
  })
}

const reduxDevtoolsAvailable = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const reduxDevtoolsComposer = (storeName) => {
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: storeName })
}

export default function (storeName = 'web_widget', options = {}) {
  const middlewares = [
    thunk,
    preventLoops,
    throttle(options.throttleEvents, options.allowedActionsFn),
    onStateChangeWrapper(onStateChangeFn),
    sendBlips,
    onStateChangeWrapper(resetActiveEmbed),
    trackAnalytics,
    persist,
    onStateChangeWrapper(queueCalls),
  ]

  let composeEnhancers = compose

  if (inDebugMode()) {
    if (reduxDevtoolsAvailable) {
      composeEnhancers = reduxDevtoolsComposer(storeName)
    } else {
      middlewares.push(reduxConsoleLogger(storeName))
    }
  }

  return composeEnhancers(applyMiddleware(...middlewares))(createStore)(reducer)
}
