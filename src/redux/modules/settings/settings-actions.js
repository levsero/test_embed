import {
  UPDATE_SETTINGS
} from './settings-action-types';
import { CONNECTION_STATUSES } from 'constants/chat';
import { getConnection, getDepartmentsList, getZChatVendor } from 'src/redux/modules/chat/chat-selectors';
import { setDepartment, clearDepartment } from 'src/redux/modules/chat/chat-actions';
import { getSettingsChatTags } from 'src/redux/modules/settings/settings-selectors';

import _ from 'lodash';

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

const handleDepartmentChange = (visitorDepartmentId, dispatch) => {
  if (visitorDepartmentId) {
    dispatch(setDepartment(visitorDepartmentId));
  } else {
    dispatch(clearDepartment());
  }
};

export function updateSettings(settings) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

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
      const visitorDepartmentName = _.get(settings, 'webWidget.chat.departments.select', '');
      const visitorDepartment = _.find(
        getDepartmentsList(state),
        (dep) => dep.name === visitorDepartmentName || dep.id === visitorDepartmentName);
      const visitorDepartmentId = _.get(visitorDepartment, 'id');

      handleDepartmentChange(visitorDepartmentId, dispatch);

      const tags = _.get(settings, 'webWidget.chat.tags');

      handleTagsChange(zChat, tags, oldTags);
    }
  };
}
