import zChat from 'vendor/web-sdk';
import {
  UPDATE_CHAT_MSG,
  SENT_CHAT_MSG_REQUEST,
  SENT_CHAT_MSG_SUCCESS,
  SENT_CHAT_MSG_FAILURE
} from './chat-action-types';

export function msgActionPayload(msg) {
  return {
    type: 'chat',
    detail: {
      type: 'chat.msg',
      nick: 'visitor:xxxx',
      timestamp: Date.now(),
      display_name: 'Visitor Joe',
      msg: msg
    }
  };
}

export function sendMsg(msg) {
  return dispatch => {
    dispatch(sendMsgRequest());

    zChat.sendChatMsg(msg, (err) => {
      if (!err) {
        return (dispatch) => {
          return dispatch(sendMsgSuccess(msg));
        };
      } else {
        return (dispatch) => {
          return dispatch(sendMsgFailure(err));
        };
      }
    });
  };
}

export function sendMsgRequest() {
  return {
    type: SENT_CHAT_MSG_REQUEST
  };
}

export function sendMsgSuccess(msg) {
  return {
    type: SENT_CHAT_MSG_SUCCESS,
    payload: msgActionPayload(msg)
  };
}

export function sendMsgFailure(err) {
  return {
    type: SENT_CHAT_MSG_FAILURE,
    payload: err
  };
}

export function updateCurrentMsg(msg) {
  return {
    type: UPDATE_CHAT_MSG,
    payload: msg
  };
}
