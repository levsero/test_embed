import _ from 'lodash';

import { getOnApiListeners } from 'src/redux/modules/base/base-selectors';

export default function listen({ getState }) {
  return (next) => (action) => {
    const { type } = action;
    const listeners = getOnApiListeners(getState());

    if (listeners[type]) {
      _.forEach(listeners[type], (listener) => {
        listener();
      });
    }
    return next(action);
  };
}
