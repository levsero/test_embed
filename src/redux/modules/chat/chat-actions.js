import zChat from 'chat-web-sdk';
import _ from 'lodash';

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
  UPDATE_CHAT_SCREEN,
  TOGGLE_END_CHAT_NOTIFICATION,
  TOGGLE_CONTACT_DETAILS_NOTIFICATION,
  SEND_CHAT_RATING_COMMENT_SUCCESS,
  SEND_CHAT_RATING_COMMENT_FAILURE,
  SEND_CHAT_FILE,
  SEND_CHAT_FILE_SUCCESS,
  SEND_CHAT_FILE_FAILURE,
  UPDATE_USER_SETTINGS
} from './chat-action-types';
import { PRECHAT_SCREEN, FEEDBACK_SCREEN } from './reducer/chat-screen-types';
import { getChatVisitor } from 'src/redux/modules/chat/chat-selectors';

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

export const endChat = () => {
  return (dispatch) => {
    zChat.endChat((err) => {
      if (!err) {
        dispatch({ type: END_CHAT_SUCCESS });
      } else {
        dispatch({ type: END_CHAT_FAILURE });
      }
    });
  };
};

export const toggleEndChatNotification = (bool) => {
  return {
    type: TOGGLE_END_CHAT_NOTIFICATION,
    payload: bool
  };
};

export const updateChatScreen = (screen) => {
  return {
    type: UPDATE_CHAT_SCREEN,
    payload: { screen }
  };
};

export const toggleContactDetailsNotification = (bool) => {
  return {
    type: TOGGLE_CONTACT_DETAILS_NOTIFICATION,
    payload: bool
  };
};

export const updateUserSettings = (settings) => {
  return {
    type: UPDATE_USER_SETTINGS,
    payload: settings
  };
};

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
  return dispatch => {
    dispatch({
      type: UPDATE_CURRENT_MSG,
      payload: msg
    });

    zChat.sendTyping(true);
    setTimeout(() => zChat.sendTyping(false), chatTypingTimeout);
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

export function sendChatComment(comment = '') {
  return (dispatch) => {
    zChat.sendChatComment(comment, (err) => {
      if (!err) {
        dispatch({
          type: SEND_CHAT_RATING_COMMENT_SUCCESS,
          payload: comment
        });
        endChat()(dispatch);
      } else {
        dispatch({ type: SEND_CHAT_RATING_COMMENT_FAILURE });
      }
    });
  };
}

export function updateAccountSettings() {
  const accountSettings = zChat._getAccountSettings();

  return (dispatch) => {
    if (accountSettings.forms.pre_chat_form.required) {
      dispatch(updateChatScreen(PRECHAT_SCREEN));
    }

    dispatch(updateUserSettings({ sound: !accountSettings.sound.disabled }));

    dispatch({
      type: UPDATE_ACCOUNT_SETTINGS,
      payload: accountSettings
    });
  };
}

export function hideChatNotification() {
  return { type: HIDE_CHAT_NOTIFICATION };
}

export function acceptEndChatNotification() {
  return (dispatch, getStateFn) => {
    const state = getStateFn();

    dispatch(toggleEndChatNotification(false));

    if (state.chat.rating === null) {
      dispatch(updateChatScreen(FEEDBACK_SCREEN));
    } else {
      dispatch(endChat());
    }
  };
}

export function sendAttachments(attachments) {
  return (dispatch, getState) => {
    const visitor = getChatVisitor(getState());

    _.forEach(attachments, (file) => {
      const time = Date.now();

      dispatch({
        type: SEND_CHAT_FILE,
        payload: {
          type: 'chat.file',
          nick: visitor.nick,
          display_name: visitor.display_name,
          timestamp: time,
          uploading: true
        }
      });

      zChat.sendFile(file, (err, data) => {
        if (!err) {
          dispatch({
            type: SEND_CHAT_FILE_SUCCESS,
            payload: {
              type: 'chat.file',
              attachment: data.url,
              nick: visitor.nick,
              display_name: visitor.display_name,
              timestamp: time,
              uploading: false
            }
          });
        } else {
          dispatch({ type: SEND_CHAT_FILE_FAILURE });
        }
      });
    });
  };
}

export function saveContactDetails(name, email) {
  return (dispatch) => {
    dispatch(toggleContactDetailsNotification(false));
    dispatch(setVisitorInfo({ display_name: name, email }));
  };
}
