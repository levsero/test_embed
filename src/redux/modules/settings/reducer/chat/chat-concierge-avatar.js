import { UPDATE_SETTINGS } from '../../settings-action-types';
import { _ } from 'lodash';

const initialState = null;

const avatarUrl = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'chat.concierge.avatarUrl', state);
    default:
      return state;
  }
};

export default avatarUrl;
