import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import onStateChange from 'redux-on-state-change';
import createLogger from 'redux-logger';

import { store } from 'service/persistence';
import { getEnvironment } from 'src/util/utils';

import reducer from 'src/redux/modules/reducer';
import onStateChangeFn from 'src/redux/middleware/onStateChange';

import { sendBlips } from 'src/redux/middleware/blip';

export default function() {
  const enableLogging = __DEV__ || getEnvironment() === 'staging' || store.get('debug');
  const logger = createLogger();
  const devToolsEnabled = window.parent.__REDUX_DEVTOOLS_EXTENSION__;
  const devToolsExtension = devToolsEnabled
                          ? window.parent.devToolsExtension()
                          : (a) => a;
  const middlewares = [
    thunk,
    onStateChange(onStateChangeFn),
    sendBlips
  ];
  let storeEnhancers;

  if (enableLogging) {
    if (!devToolsEnabled) middlewares.push(logger);
    storeEnhancers = [applyMiddleware(...middlewares), devToolsExtension];
  } else {
    storeEnhancers = [applyMiddleware(...middlewares)];
  }

  return compose(...storeEnhancers)(createStore)(reducer);
}
