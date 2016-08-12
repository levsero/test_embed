import { createStore } from 'redux';

import reducer from 'src/redux/reducers';

export default function createStore() {
  const store = createStore(reducer);

  return store;
}
