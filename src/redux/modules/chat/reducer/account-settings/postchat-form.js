import _ from 'lodash';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS, UPDATE_PREVIEWER_SETTINGS } from '../../chat-action-types';

const initialState = {
  header: '',
  message: ''
};

const postchatForm = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      const { header, message } = action.payload.forms.post_chat_form;

      return {
        header: _.toString(header),
        message: _.toString(message)
      };
    case UPDATE_PREVIEWER_SETTINGS:
      const { header: pHeader, message: pMsg } = _.get(action.payload, 'forms.post_chat_form', state);

      return {
        header: _.toString(pHeader),
        message: _.toString(pMsg)
      };
    default:
      return state;
  }
};

export default postchatForm;
