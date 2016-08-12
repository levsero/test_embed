import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import logger from 'src/redux/middleware/logger';
import reducer from 'src/redux/reducers';

export default function() {
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, logger)
  )(createStore)

  return createStoreWithMiddleware(reducer);
}
