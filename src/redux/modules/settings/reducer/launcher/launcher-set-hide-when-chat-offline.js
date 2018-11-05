import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = false;

const setHideWhenChatOffline = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return Boolean(_.get(payload, 'webWidget.launcher.setHideWhenChatOffline', state));
    default:
      return state;
  }
};

export default setHideWhenChatOffline;
