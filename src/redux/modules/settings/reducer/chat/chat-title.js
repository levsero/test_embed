import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = null;

const title = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.chat.title', state);
    default:
      return state;
  }
};

export default title;
