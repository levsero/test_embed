import _ from 'lodash';

import {
  PRE_CHAT_FORM_ON_CHANGE,
  VISITOR_DEFAULT_DEPARTMENT_SELECTED,
  CHAT_BADGE_MESSAGE_CHANGED,
  SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE,
  SDK_VISITOR_UPDATE
} from '../../chat-action-types';
import { PREFILL_RECEIVED, API_CLEAR_FORM } from '../../../base/base-action-types';
import { getDisplayName } from 'src/util/chat';

const initialState = {
  name: '',
  email: '',
  phone: '',
  department: '',
  message: ''
};

const preChatForm = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_BADGE_MESSAGE_CHANGED:
      return {
        ...state,
        message: action.payload
      };
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...payload.prefillValues
      };
    case SDK_VISITOR_UPDATE:
      const payloadEmail = _.get(payload, 'detail.email', '');

      return {
        ...state,
        name: getDisplayName(_.get(payload, 'detail.display_name', ''), state.name),
        email: payloadEmail !== '' ? payloadEmail : state.email,
        phone: _.get(payload, 'detail.phone', state.phone)
      };
    case PRE_CHAT_FORM_ON_CHANGE:
    case VISITOR_DEFAULT_DEPARTMENT_SELECTED:
      return { ...state, ...payload };
    case SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE:
      return {
        ...state,
        department: _.get(payload, 'detail.id', state.department)
      };
    case API_CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

export default preChatForm;
