import { getOnApiListeners } from 'src/redux/modules/base/base-selectors';
import _ from 'lodash';

export default function listen({ getState }) {
  return (next) => (action) => {
    const actionCreatorPromise = new Promise((resolve) => {
      resolve(next(action));
    });

    // Wrapped in promise to get the latest state of the application
    // in order to fire API callbacks and pass params with accurate state
    actionCreatorPromise.then(() => {
      const { type, payload } = action;
      const state = getState();
      const listeners = getOnApiListeners(state);

      if (listeners[type]) {
        const { callbackList, selectors, useActionPayload } = listeners[type];
        const argumentList = selectors.map((selector) => selector(state));

        if (useActionPayload) {
          argumentList.push(_.get(payload, 'detail', payload));
        }

        callbackList.forEach((callback) => {
          callback(...argumentList);
        });
      }
    });

    return actionCreatorPromise;
  };
}
