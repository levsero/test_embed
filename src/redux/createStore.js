import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from 'src/redux/reducers';

export default function() {
  const logger = createLogger();
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, logger)
  )(createStore);

  return createStoreWithMiddleware(reducer);
}
