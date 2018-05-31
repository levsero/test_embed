import {
  UPDATE_SETTINGS_CHAT_SUPPRESS,
  RESET_SETTINGS_CHAT_SUPPRESS,
  UPDATE_SETTINGS
} from './settings-action-types';
import { CONNECTION_STATUSES } from 'constants/chat';
import { getConnection, getDepartmentsList } from 'src/redux/modules/chat/chat-selectors';
import { setDepartment, clearDepartment } from 'src/redux/modules/chat/chat-actions';

import _ from 'lodash';

export function updateSettingsChatSuppress(bool) {
  return {
    type: UPDATE_SETTINGS_CHAT_SUPPRESS,
    payload: bool
  };
}

export function resetSettingsChatSuppress() {
  return { type: RESET_SETTINGS_CHAT_SUPPRESS };
}

export function updateSettings(settings) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_SETTINGS,
      payload: settings
    });

    const state = getState();

    if (getConnection(state) === CONNECTION_STATUSES.CONNECTED) {
      const visitorDepartmentName = _.get(settings, 'webWidget.chat.visitor.departments.department', '');
      const visitorDepartment = _.find(getDepartmentsList(state), (dep) => dep.name === visitorDepartmentName);
      const visitorDepartmentId = _.get(visitorDepartment, 'id');

      if (visitorDepartmentId) {
        dispatch(setDepartment(visitorDepartmentId));
      } else {
        dispatch(clearDepartment());
      }
    }
  };
}
