import { ADD_RESTRICTED_IMAGE } from '../helpCenter-action-types';
import _ from 'lodash';

const initialState = {};

const restrictedImages = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_RESTRICTED_IMAGE:
      return _.extend({}, state, payload);
    default:
      return state;
  }
};

export default restrictedImages;
