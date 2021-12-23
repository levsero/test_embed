import { trackAnalytics } from 'classicSrc/redux/middleware/analytics'
import { sendBlips } from 'classicSrc/redux/middleware/blip'
import onStateChangeFn from 'classicSrc/redux/middleware/onStateChange/onStateChange'
import onStateChangeWrapper from 'classicSrc/redux/middleware/onStateChange/wrapper'
import persist from 'classicSrc/redux/middleware/persist'
import preventLoops from 'classicSrc/redux/middleware/preventLoops'
import queueCalls from 'classicSrc/redux/middleware/queue'
import resetActiveEmbed from 'classicSrc/redux/middleware/resetActiveEmbed'
import throttle from 'classicSrc/redux/middleware/throttle'
import reducer from 'classicSrc/redux/modules/reducer'
import { createStore, compose, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { inDebugMode } from '@zendesk/widget-shared-services'

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
