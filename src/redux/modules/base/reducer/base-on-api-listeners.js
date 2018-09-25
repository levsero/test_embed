import _ from 'lodash';
import { API_ON_RECIEVED } from '../base-action-types';

const initialState = {};

const onApiListeners = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case API_ON_RECIEVED:
      const { callback, actions } = payload;
      let newState = _.cloneDeep(state);

      _.forEach(actions, (action) => {
        if (state[action]) {
          newState[action].push(callback);
        } else {
          newState[action] = [ callback ];
        }
      });
      return newState;
    default:
      return state;
  }
};

export default onApiListeners;
