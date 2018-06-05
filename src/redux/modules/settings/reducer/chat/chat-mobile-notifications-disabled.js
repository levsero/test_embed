import {
  UPDATE_SETTINGS
} from '../../settings-action-types';

import _ from 'lodash';

const initialState = false;

const mobileNotificationsDisabled = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.chat.mobile.notifications.disable', state);
    default:
      return state;
  }
};

export default mobileNotificationsDisabled;
