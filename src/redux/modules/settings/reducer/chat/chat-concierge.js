import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  avatarPath: null,
  name: null,
  title: null
};

const concierge = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        avatarPath: _.get(payload, 'webWidget.chat.concierge.avatarPath', state.avatarPath),
        name: _.get(payload, 'webWidget.chat.concierge.name', state.name),
        title: _.get(payload, 'webWidget.chat.concierge.title', state.title)
      };
    default:
      return state;
  }
};

export default concierge;
