import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import onStateChange from 'redux-on-state-change';
import createLogger from 'redux-logger';

import { store } from 'service/persistence';
import { getEnvironment } from 'src/util/utils';

import reducer from 'src/redux/modules/reducer';
import onStateChangeFn from 'src/redux/middleware/onStateChange';

import { sendBlips } from 'src/redux/middleware/blip';

function loggerTitleFormatter(storeName) {
  return (action, time, took) => [`%c[${storeName}] ${String(action.type)}`, `%c@ ${time}`].join(' ');
}

export default function(storeName = 'web_widget') {
  const enableLogging = __DEV__ || getEnvironment() === 'staging' || store.get('debug');
  const logger = createLogger({ titleFormatter: loggerTitleFormatter(storeName) });
  const devToolsExtension = window.parent.__REDUX_DEVTOOLS_EXTENSION__
    && window.parent.__REDUX_DEVTOOLS_EXTENSION__({ name: storeName });
  const middlewares = [
    thunk,
    onStateChange(onStateChangeFn),
    sendBlips
  ];
  let storeEnhancers;

  if (enableLogging) {
    storeEnhancers = !!devToolsExtension
      ? [applyMiddleware(...middlewares), devToolsExtension]
      : [applyMiddleware(...middlewares, logger)];
  } else {
    storeEnhancers = [applyMiddleware(...middlewares)];
  }

  return compose(...storeEnhancers)(createStore)(reducer);
}
