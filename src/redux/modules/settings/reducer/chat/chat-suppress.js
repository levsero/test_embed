import _ from 'lodash';

import { settings } from 'service/settings';
import { UPDATE_SETTINGS } from '../../settings-action-types';
import { ZOPIM_END_CHAT, ZOPIM_IS_CHATTING } from '../../../zopimChat/zopimChat-action-types';

const initialState = !!settings.get('chat.suppress');

const suppress = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return _.get(payload, 'webWidget.chat.suppress', state);
    case ZOPIM_IS_CHATTING:
      return false;
    case ZOPIM_END_CHAT:
      return initialState;
    default:
      return state;
  }
};

export default suppress;
