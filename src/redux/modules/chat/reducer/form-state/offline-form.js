import {
  CHAT_OFFLINE_FORM_CHANGED,
  SDK_VISITOR_UPDATE,
  OFFLINE_FORM_BACK_BUTTON_CLICKED } from '../../chat-action-types';
import { PREFILL_RECEIVED, API_CLEAR_FORM } from '../../../base/base-action-types';
import { getDisplayName } from 'src/util/chat';
import _ from 'lodash';

const initialState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const offlineForm = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_OFFLINE_FORM_CHANGED:
      return {
        ...initialState,
        ...payload
      };
    case SDK_VISITOR_UPDATE:
      const payloadEmail = _.get(payload, 'detail.email', '');

      return {
        ...state,
        name: getDisplayName(_.get(payload, 'detail.display_name', ''), state.name),
        email: _.isEmpty(payloadEmail) ? state.email : payloadEmail,
        phone: _.get(payload, 'detail.phone', state.phone)
      };
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...payload.prefillValues
      };
    case OFFLINE_FORM_BACK_BUTTON_CLICKED:
      return { ...state, message: '' };
    case API_CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

export default offlineForm;
