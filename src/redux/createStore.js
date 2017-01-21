import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from 'src/redux/modules/reducer';

export default function() {
  const logger = createLogger();
  const devToolsExtension = __DEV__ && window.parent.devToolsExtension
                          ? window.parent.devToolsExtension()
                          : (a) => a;

  const storeEnhancers = [
    applyMiddleware(thunk, logger),
    devToolsExtension
  ];

  const store = compose(...storeEnhancers)(createStore)(reducer);

  return store;
}
