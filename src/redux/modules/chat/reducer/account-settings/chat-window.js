import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {
  title: ''
};

const chatWindow = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
    case UPDATE_PREVIEWER_SETTINGS:
      const { title } = _.get(action.payload, 'chat_window.title_bar', state);

      return {
        title: _.toString(title)
      };
    default:
      return state;
  }
};

export default chatWindow;
