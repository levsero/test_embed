import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = false;

const hideWhenOffline = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return Boolean(_.get(payload, 'webWidget.chat.hideWhenOffline', state));
    default:
      return state;
  }
};

export default hideWhenOffline;
