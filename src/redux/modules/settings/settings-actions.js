import _ from 'lodash';

import {
  UPDATE_SETTINGS
} from './settings-action-types';
import { CONNECTION_STATUSES } from 'constants/chat';
import {
  getConnection,
  getZChatVendor,
  getDefaultSelectedDepartment
} from 'src/redux/modules/chat/chat-selectors';
import { setDepartment } from 'src/redux/modules/chat/chat-actions';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';

const handleTagsChange = (zChat, tags, oldTags) => {
  if (!_.isEqual(tags, oldTags) && _.isArray(tags)) {
    _.forEach(oldTags, (tag) => {
      zChat.removeTag(tag);
    });
    _.forEach(tags, (tag) => {
      zChat.addTag(tag);
    });
  }
};

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
      dispatch(updateChatSettings(oldTags));
    }
  };
}

export function updateChatSettings(oldTags) {
  return (dispatch, getState) => {
    const state = getState();
    const tags = getSettingsChatTags(state);
    const zChat = getZChatVendor(state);
    const visitorDepartmentId = _.get(getDefaultSelectedDepartment(state), 'id');

    handleTagsChange(zChat, tags, oldTags);

    if (visitorDepartmentId) {
      dispatch(setDepartment(visitorDepartmentId));
    }
  };
}
