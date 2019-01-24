import _ from 'lodash';
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types';

const initialState = {
  chatLabelOnline: null,
  chatLabelOffline: null
};

const chatContactOptions = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        chatLabelOnline: _.get(payload, 'chatLabelOnline', state.chatLabelOnline),
        chatLabelOffline: _.get(payload, 'chatLabelOffline', state.chatLabelOffline),
      };
    default:
      return state;
  }
};

export default chatContactOptions;
