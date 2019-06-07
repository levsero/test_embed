import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import { inDebugMode } from 'utility/runtime'
import onStateChangeWrapper from 'src/redux/middleware/onStateChange/wrapper'
import reducer from 'src/redux/modules/reducer'
import onStateChangeFn from 'src/redux/middleware/onStateChange/onStateChange'
import persist from 'src/redux/middleware/persist'
import throttle from 'src/redux/middleware/throttle'
import preventLoops from 'src/redux/middleware/preventLoops'
import resetActiveEmbed from 'src/redux/middleware/resetActiveEmbed'
import { trackAnalytics } from 'src/redux/middleware/analytics'
import { sendBlips } from 'src/redux/middleware/blip'
import queueCalls from 'src/redux/middleware/queue'

const reduxConsoleLogger = (storeName) => {
  return createLogger({
    collapsed: true,
    titleFormatter: (action) => [`${storeName}`, `%c${String(action.type)}`, '%c'].join(' ')
  })
}

const useReduxDevtools = inDebugMode() && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const reduxDevtoolsComposer = (storeName) => {
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: storeName })
}

export default function(storeName = 'web_widget', options = {}) {
  const middlewares = [
    thunk,
    preventLoops,
    throttle(options.throttleEvents, options.allowedActionsFn),
    onStateChangeWrapper(onStateChangeFn),
    sendBlips,
    onStateChangeWrapper(resetActiveEmbed),
    trackAnalytics,
    persist,
    onStateChangeWrapper(queueCalls)
  ]

  if (inDebugMode()) {
    middlewares.push(reduxConsoleLogger(storeName))
  }

  const composeEnhancers = useReduxDevtools ? reduxDevtoolsComposer(storeName) : compose

  return composeEnhancers(applyMiddleware(...middlewares))(createStore)(reducer)
}
