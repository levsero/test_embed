import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reduxCatch from 'redux-catch';

import { store } from 'service/persistence';

import onStateChangeWrapper from 'src/redux/middleware/onStateChange/wrapper';
import reducer from 'src/redux/modules/reducer';
import onStateChangeFn from 'src/redux/middleware/onStateChange/onStateChange';
import persist from 'src/redux/middleware/persist';
import throttle from 'src/redux/middleware/throttle';
import listen from 'src/redux/middleware/listener';
import preventLoops from 'src/redux/middleware/preventLoops';
import resetActiveEmbed from 'src/redux/middleware/resetActiveEmbed';

import { trackAnalytics } from 'src/redux/middleware/analytics';
import { sendBlips } from 'src/redux/middleware/blip';
import queueCalls from 'src/redux/middleware/queue';

function loggerTitleFormatter(storeName) {
  return (action) => [`${storeName}`, `%c${String(action.type)}`, '%c'].join(' ');
}

export default function(storeName = 'web_widget', options = {}) {
  const enableLogging = __DEV__ || store.get('debug');
  const logger = createLogger({
    collapsed: true,
    titleFormatter: loggerTitleFormatter(storeName)
  });
  const reduxCatchLogger = reduxCatch((err) => console.error(err)); // eslint-disable-line no-console
  const devToolsExtension = window.parent.__REDUX_DEVTOOLS_EXTENSION__
    && window.parent.__REDUX_DEVTOOLS_EXTENSION__({ name: storeName });
  const middlewares = [
    thunk,
    preventLoops,
    throttle(options.throttleEvents, options.allowedActionsFn),
    onStateChangeWrapper(onStateChangeFn),
    sendBlips,
    listen,
    onStateChangeWrapper(resetActiveEmbed),
    trackAnalytics,
    persist,
    onStateChangeWrapper(queueCalls)
  ];
  let storeEnhancers;

  if (enableLogging) {
    storeEnhancers = devToolsExtension
      ? [applyMiddleware(...middlewares, reduxCatchLogger), devToolsExtension]
      : [applyMiddleware(...middlewares, reduxCatchLogger, logger)];
  } else {
    storeEnhancers = [applyMiddleware(...middlewares)];
  }

  return compose(...storeEnhancers)(createStore)(reducer);
}
