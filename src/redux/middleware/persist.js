import _ from 'lodash';

import { UPDATE_ACTIVE_EMBED, UPDATE_WIDGET_SHOWN } from 'src/redux/modules/base/base-action-types';
import {
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  END_CHAT_REQUEST_SUCCESS
} from 'src/redux/modules/chat/chat-action-types';
import { store } from 'service/persistence';

const keysToStore = {
  activeEmbed: 'base',
  widgetShown: 'base',
  is_chatting: 'chat' // eslint-disable-line camelcase
};
const actionsToStoreOn = [
  UPDATE_WIDGET_SHOWN,
  UPDATE_ACTIVE_EMBED,
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  END_CHAT_REQUEST_SUCCESS
];

export default function persist({ getState }) {
  return (next) => (action) => {
    const result = next(action);

    const { type } = action;
    const state = getState();

    if (_.includes(actionsToStoreOn, type)) {
      const stateToStore = _.reduce(keysToStore, (res, val, key) => {
        res[key] = state[val][key];
        return res;
      }, {});

      store.set('store', stateToStore);
    }

    return result;
  };
}
