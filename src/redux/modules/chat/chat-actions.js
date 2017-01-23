import zChat from 'vendor/web-sdk';

import {
  UPDATE_CURRENT_MSG,
  SENT_CHAT_MSG_REQUEST,
  SENT_CHAT_MSG_SUCCESS,
  SENT_CHAT_MSG_FAILURE
} from './chat-action-types';

export function sendMsg(msg) {
  return dispatch => {
    dispatch(sendMsgRequest());

    zChat.sendChatMsg(msg, (err) => {
      if (!err) {
        dispatch(sendMsgSuccess(msg));
      } else {
        dispatch(sendMsgFailure(err));
      }
    });
  };
}

export function updateCurrentMsg(msg) {
  return {
    type: UPDATE_CURRENT_MSG,
    payload: msg
  };
}

function sendMsgRequest() {
  return {
    type: SENT_CHAT_MSG_REQUEST
  };
}

function sendMsgSuccess(msg) {
  return {
    type: SENT_CHAT_MSG_SUCCESS,
    payload: {
      msg,
      timestamp: Date.now()
    }
  };
}

function sendMsgFailure(err) {
  return {
    type: SENT_CHAT_MSG_FAILURE,
    payload: err
  };
}
