import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import { getEnvironment } from 'src/util/utils';

import reducer from 'src/redux/modules/reducer';

export default function() {
  const enableLogging = __DEV__ || getEnvironment() === 'staging';

  const logger = enableLogging ? createLogger() : () => (a) => a;
  const devToolsExtension = enableLogging && window.parent.devToolsExtension
                          ? window.parent.devToolsExtension()
                          : (a) => a;

  const storeEnhancers = [
    applyMiddleware(thunk, logger),
    devToolsExtension
  ];

  return compose(...storeEnhancers)(createStore)(reducer);
}
