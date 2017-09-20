import zChat from 'chat-web-sdk';

import {
  END_CHAT_SUCCESS,
  END_CHAT_FAILURE,
  SENT_CHAT_MSG_REQUEST,
  SENT_CHAT_MSG_SUCCESS,
  SENT_CHAT_MSG_FAILURE,
  UPDATE_CURRENT_MSG,
  UPDATE_VISITOR_INFO_SUCCESS,
  UPDATE_VISITOR_INFO_FAILURE,
  UPDATE_ACCOUNT_SETTINGS,
  SEND_CHAT_RATING_SUCCESS,
  SEND_CHAT_RATING_FAILURE,
  HIDE_CHAT_NOTIFICATION,
  UPDATE_CHAT_SCREEN
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

export function setVisitorInfo(visitor) {
  return (dispatch) => {
    zChat.setVisitorInfo(visitor, (err) => {
      if (!err) {
        dispatch({
          type: UPDATE_VISITOR_INFO_SUCCESS,
          payload: visitor
        });
      } else {
        dispatch({ type: UPDATE_VISITOR_INFO_FAILURE });
      }
    });
  };
}

export function sendChatRating(rating = null) {
  return (dispatch) => {
    zChat.sendChatRating(rating, (err) => {
      if (!err) {
        dispatch({
          type: SEND_CHAT_RATING_SUCCESS,
          payload: rating
        });
      } else {
        dispatch({ type: SEND_CHAT_RATING_FAILURE });
      }
    });
  };
}

export function updateAccountSettings() {
  return {
    type: UPDATE_ACCOUNT_SETTINGS,
    payload: zChat._getAccountSettings()
  };
}

export function hideChatNotification() {
  return { type: HIDE_CHAT_NOTIFICATION };
}

export function updateChatScreen(screen) {
  return {
    type: UPDATE_CHAT_SCREEN,
    payload: { screen }
  };
}
