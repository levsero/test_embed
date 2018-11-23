import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {
  message_type: '',
  position: 'br',
  color: {
    primary: '#555555',
    banner: ''
  }
};

const theme = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      return {
        message_type: action.payload.theme.message_type,
        position: action.payload.theme.chat_window.position,
        color: {
          primary: _.get(action.payload, 'theme.colors.primary', state.color.primary),
          banner: _.get(action.payload, 'theme.colors.banner', state.color.banner)
        }
      };
    case UPDATE_PREVIEWER_SETTINGS:
      return {
        message_type: _.get(action.payload, 'theme.message_type', state.message_type),
        position: _.get(action.payload, 'theme.chat_window.position', state.position),
        color: {
          primary: _.get(action.payload, 'theme.colors.primary', state.color.primary),
          banner: _.get(action.payload, 'theme.colors.banner', state.color.banner)
        }
      };
    default:
      return state;
  }
};

export default theme;
