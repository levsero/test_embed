import zChat from 'vendor/web-sdk';

import {
  UPDATE_CURRENT_MSG,
  SENT_CHAT_MSG_REQUEST,
  SENT_CHAT_MSG_SUCCESS,
  SENT_CHAT_MSG_FAILURE
} from './chat-action-types';

export function sendMsg(msg) {
  return (dispatch, getState) => {
    dispatch(sendMsgRequest());

    zChat.sendChatMsg(msg, (err) => {
      if (!err) {
        const { visitor } = getState().chat;

        dispatch(sendMsgSuccess(msg, visitor));
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

function sendMsgSuccess(msg, visitor) {
  return {
    type: SENT_CHAT_MSG_SUCCESS,
    payload: {
      type: 'chat.msg',
      msg,
      nick: visitor.nick,
      display_name: visitor.display_name,
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
