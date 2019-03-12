import { UPDATE_SETTINGS } from '../settings-action-types';
import _ from 'lodash';

const initialState = true;

const cookies = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.cookies', state);
    default:
      return state;
  }
};

export default cookies;
