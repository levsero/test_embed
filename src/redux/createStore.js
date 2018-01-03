import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import onStateChange from 'redux-on-state-change';
import createLogger from 'redux-logger';

import { getEnvironment } from 'src/util/utils';

import reducer from 'src/redux/modules/reducer';
import onStateChangeFn from 'src/redux/middleware/onStateChange';

import { sendBlips } from 'src/redux/middleware/blip';

export default function() {
  const enableLogging = __DEV__ || getEnvironment() === 'staging';
  const logger = createLogger();
  const devToolsExtension = window.parent.devToolsExtension
                          ? window.parent.devToolsExtension()
                          : (a) => a;
  const middlewares = [
    thunk,
    onStateChange(onStateChangeFn),
    sendBlips
  ];
  let storeEnhancers;

  if (enableLogging) {
    storeEnhancers = [applyMiddleware(...middlewares), devToolsExtension];
    // storeEnhancers = [applyMiddleware(...middlewares, logger), devToolsExtension];
  } else {
    storeEnhancers = [applyMiddleware(...middlewares)];
  }

  return compose(...storeEnhancers)(createStore)(reducer);
}
