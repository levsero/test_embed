import _ from 'lodash';
import { API_ON_RECEIVED } from '../base-action-types';

const initialState = {};

const onApiListeners = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case API_ON_RECEIVED:
      const { actionType, selectors, callback, useActionPayload } = payload;
      let newState = _.cloneDeep(state);

      if (state[actionType]) {
        newState[actionType].callbackList.push(callback);
      } else {
        newState[actionType] = {
          callbackList: [callback],
          selectors,
          useActionPayload
        };
      }

      return newState;
    default:
      return state;
  }
};

export default onApiListeners;
