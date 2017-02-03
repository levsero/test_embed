import zChat from 'vendor/web-sdk';

import {
  END_CHAT_SUCCESS,
  END_CHAT_FAILURE,
  SENT_CHAT_MSG_REQUEST,
  SENT_CHAT_MSG_SUCCESS,
  SENT_CHAT_MSG_FAILURE,
  UPDATE_CURRENT_MSG
} from './chat-action-types';

const chatTypingTimeout = 2000;

const sendMsgRequest = () => {
  return {
    type: SENT_CHAT_MSG_REQUEST
  };
};

const sendMsgSuccess = (msg, visitor) => {
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
};

const sendMsgFailure = (err) => {
  return {
    type: SENT_CHAT_MSG_FAILURE,
    payload: err
  };
};

export const sendMsg = (msg) => {
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
};

export const updateCurrentMsg = (msg) => {
  return dispatch => {
    dispatch({
      type: UPDATE_CURRENT_MSG,
      payload: msg
    });

    zChat.sendTyping(true);
    setTimeout(() => zChat.sendTyping(false), chatTypingTimeout);
  };
};

export function endChat() {
  return (dispatch) => {
    zChat.endChat((err) => {
      if (!err) {
        dispatch({ type: END_CHAT_SUCCESS });
      } else {
        dispatch({ type: END_CHAT_FAILURE });
      }
    });
  };
}
