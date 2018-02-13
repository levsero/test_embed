import _ from 'lodash';

const zChat = (() => { try { return require('chat-web-sdk'); } catch (_) {} })();

import {
  END_CHAT_REQUEST_SUCCESS,
  END_CHAT_REQUEST_FAILURE,
  CHAT_MSG_REQUEST_SENT,
  CHAT_MSG_REQUEST_SUCCESS,
  CHAT_MSG_REQUEST_FAILURE,
  CHAT_BOX_CHANGED,
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  SET_VISITOR_INFO_REQUEST_FAILURE,
  GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
  CHAT_RATING_REQUEST_SUCCESS,
  CHAT_RATING_REQUEST_FAILURE,
  HIDE_CHAT_NOTIFICATION,
  UPDATE_CHAT_SCREEN,
  NEW_AGENT_MESSAGE_RECEIVED,
  CHAT_OPENED,
  CHAT_RATING_COMMENT_REQUEST_SUCCESS,
  CHAT_RATING_COMMENT_REQUEST_FAILURE,
  CHAT_FILE_REQUEST_SENT,
  CHAT_FILE_REQUEST_SUCCESS,
  CHAT_FILE_REQUEST_FAILURE,
  SOUND_ICON_CLICKED
} from './chat-action-types';
import { PRECHAT_SCREEN, FEEDBACK_SCREEN } from './chat-screen-types';
import { getChatVisitor } from 'src/redux/modules/chat/chat-selectors';

const chatTypingTimeout = 2000;

const sendMsgRequest = () => {
  return {
    type: CHAT_MSG_REQUEST_SENT
  };
};

const sendMsgSuccess = (msg, visitor) => {
  return {
    type: CHAT_MSG_REQUEST_SUCCESS,
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
    type: CHAT_MSG_REQUEST_FAILURE,
    payload: err
  };
};

export const endChat = () => {
  return (dispatch, getState) => {
    zChat.endChat((err) => {
      if (!err) {
        dispatch({ type: END_CHAT_REQUEST_SUCCESS });

        if (getState().chat.rating === null && getState().chat.accountSettings.rating.enabled) {
          dispatch(updateChatScreen(FEEDBACK_SCREEN));
        }
      } else {
        dispatch({ type: END_CHAT_REQUEST_FAILURE });
      }
    });
  };
};

export const updateChatScreen = (screen) => {
  return {
    type: UPDATE_CHAT_SCREEN,
    payload: { screen }
  };
};

export const handleSoundIconClick = (settings) => {
  return {
    type: SOUND_ICON_CLICKED,
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

export function handleChatBoxChange(msg) {
  return dispatch => {
    dispatch({
      type: CHAT_BOX_CHANGED,
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
          type: SET_VISITOR_INFO_REQUEST_SUCCESS,
          payload: visitor
        });
      } else {
        dispatch({ type: SET_VISITOR_INFO_REQUEST_FAILURE });
      }
    });
  };
}

export function sendChatRating(rating = null) {
  return (dispatch) => {
    zChat.sendChatRating(rating, (err) => {
      if (!err) {
        dispatch({
          type: CHAT_RATING_REQUEST_SUCCESS,
          payload: rating
        });
      } else {
        dispatch({ type: CHAT_RATING_REQUEST_FAILURE });
      }
    });
  };
}

export function sendChatComment(comment = '') {
  return (dispatch) => {
    zChat.sendChatComment(comment, (err) => {
      if (!err) {
        dispatch({
          type: CHAT_RATING_COMMENT_REQUEST_SUCCESS,
          payload: comment
        });
        endChat()(dispatch);
      } else {
        dispatch({ type: CHAT_RATING_COMMENT_REQUEST_FAILURE });
      }
    });
  };
}

export function getAccountSettings() {
  const accountSettings = zChat._getAccountSettings();

  return (dispatch) => {
    if (accountSettings.forms.pre_chat_form.required) {
      dispatch(updateChatScreen(PRECHAT_SCREEN));
    }

    dispatch({
      type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
      payload: accountSettings
    });
  };
}

export function hideChatNotification() {
  return { type: HIDE_CHAT_NOTIFICATION };
}

export function sendAttachments(attachments) {
  return (dispatch, getState) => {
    const visitor = getChatVisitor(getState());

    _.forEach(attachments, (file) => {
      const time = Date.now();

      dispatch({
        type: CHAT_FILE_REQUEST_SENT,
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
            type: CHAT_FILE_REQUEST_SUCCESS,
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
          dispatch({ type: CHAT_FILE_REQUEST_FAILURE });
        }
      });
    });
  };
}

export function newAgentMessageReceived() {
  return { type: NEW_AGENT_MESSAGE_RECEIVED };
}

export function chatOpened() {
  return { type: CHAT_OPENED };
}
