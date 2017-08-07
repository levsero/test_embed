import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import onStateChange from 'redux-on-state-change';
import createLogger from 'redux-logger';

import { getEnvironment } from 'src/util/utils';

import reducer from 'src/redux/modules/reducer';
import onStateChangeFn from 'src/redux/middleware/onStateChange';

export default function() {
  const enableLogging = __DEV__ || getEnvironment() === 'staging';
  const logger = createLogger();
  const devToolsExtension = window.parent.devToolsExtension
                          ? window.parent.devToolsExtension()
                          : (a) => a;

  const storeEnhancers = enableLogging
                       ? [applyMiddleware(thunk, onStateChange(onStateChangeFn), logger), devToolsExtension]
                       : [applyMiddleware(thunk, onStateChange(onStateChangeFn))];

  return compose(...storeEnhancers)(createStore)(reducer);
}
