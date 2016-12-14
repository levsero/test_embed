import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from 'src/redux/reducers';

export default function() {
  const logger = createLogger();
  const devToolsExtension = __DEV__
                          ? window.parent.devToolsExtension && window.parent.devToolsExtension()
                          : (a) => a;

  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, logger),
    devToolsExtension
  )(createStore);

  return createStoreWithMiddleware(reducer);
}
