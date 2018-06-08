import {
  UPDATE_SETTINGS_CHAT_SUPPRESS,
  RESET_SETTINGS_CHAT_SUPPRESS,
  UPDATE_SETTINGS
} from './settings-action-types';
import { CONNECTION_STATUSES } from 'constants/chat';
import { getConnection, getDepartmentsList } from 'src/redux/modules/chat/chat-selectors';
import { setDepartment, clearDepartment } from 'src/redux/modules/chat/chat-actions';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';

import _ from 'lodash';

const zChat = (() => { try { return require('chat-web-sdk'); } catch (_) {} })();

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
    if (!_.get(settings, 'webWidget')) {
      settings = {
        webWidget: {
          ...settings
        }
      };
    }

    const oldTags = getSettingsChatTags(getState());

    dispatch({
      type: UPDATE_SETTINGS,
      payload: settings
    });

    const state = getState();

    if (getConnection(state) === CONNECTION_STATUSES.CONNECTED) {
      const visitorDepartmentName = _.get(settings, 'webWidget.chat.visitor.departments.department', '');
      const visitorDepartment = _.find(getDepartmentsList(state), (dep) => dep.name === visitorDepartmentName);
      const visitorDepartmentId = _.get(visitorDepartment, 'id');

      handleDepartmentChange(visitorDepartmentId, dispatch);

      const tags = _.get(settings, 'webWidget.chat.tags');

      handleTagsChange(tags, oldTags);
    }
  };
}

const handleTagsChange = (tags, oldTags) => {
  if (!_.isEqual(tags, oldTags) && _.isArray(tags)) {
    _.forEach(oldTags, (tag) => {
      zChat.removeTag(tag);
    });

    _.forEach(tags, (tag) => {
      zChat.addTag(tag);
    });
  }
};

const handleDepartmentChange = (visitorDepartmentId, dispatch) => {
  if (visitorDepartmentId) {
    dispatch(setDepartment(visitorDepartmentId));
  } else {
    dispatch(clearDepartment());
  }
};
