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
  CHAT_NOTIFICATION_DISMISSED,
  CHAT_NOTIFICATION_RESPONDED,
  UPDATE_CHAT_SCREEN,
  NEW_AGENT_MESSAGE_RECEIVED,
  CHAT_OPENED,
  CHAT_RATING_COMMENT_REQUEST_SUCCESS,
  CHAT_RATING_COMMENT_REQUEST_FAILURE,
  CHAT_FILE_REQUEST_SENT,
  CHAT_FILE_REQUEST_SUCCESS,
  CHAT_FILE_REQUEST_FAILURE,
  SOUND_ICON_CLICKED,
  EMAIL_TRANSCRIPT_SUCCESS,
  EMAIL_TRANSCRIPT_FAILURE,
  EMAIL_TRANSCRIPT_REQUEST_SENT,
  RESET_EMAIL_TRANSCRIPT,
  CHAT_OFFLINE_FORM_CHANGED
} from './chat-action-types';
import { PRECHAT_SCREEN, FEEDBACK_SCREEN } from './chat-screen-types';
import { getChatVisitor, getShowRatingScreen } from 'src/redux/modules/chat/chat-selectors';

const chatTypingTimeout = 2000;

const getChatMessagePayload = (msg, visitor, timestamp) => ({
  type: 'chat.msg',
  msg,
  nick: visitor.nick,
  display_name: visitor.display_name,
  timestamp
});

const sendMsgRequest = (msg, visitor, timestamp) => {
  return {
    type: CHAT_MSG_REQUEST_SENT,
    payload: {
      ...getChatMessagePayload(msg, visitor, timestamp),
      pending: true
    }
  };
};

const sendMsgSuccess = (msg, visitor, timestamp) => {
  return {
    type: CHAT_MSG_REQUEST_SUCCESS,
    payload: {
      ...getChatMessagePayload(msg, visitor, timestamp),
      pending: false
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
  return (dispatch) => {
    zChat.endChat((err) => {
      if (!err) {
        dispatch({ type: END_CHAT_REQUEST_SUCCESS });
      } else {
        dispatch({ type: END_CHAT_REQUEST_FAILURE });
      }
    });
  };
};

export const endChatViaPostChatScreen = () => {
  return (dispatch, getState) => {
    if (getShowRatingScreen(getState())) {
      dispatch(updateChatScreen(FEEDBACK_SCREEN));
    }
    else {
      dispatch(endChat());
    }
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
    const timestamp = Date.now();
    let visitor = getChatVisitor(getState());

    if (visitor.nick) {
      dispatch(sendMsgRequest(msg, visitor, timestamp));
    }

    zChat.sendChatMsg(msg, (err) => {
      if (!err) {
        visitor = getChatVisitor(getState());
        dispatch(sendMsgSuccess(msg, visitor, timestamp));
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

export function sendEmailTranscript(email) {
  return (dispatch) => {
    dispatch({
      type: EMAIL_TRANSCRIPT_REQUEST_SENT,
      payload: email
    });

    zChat.sendEmailTranscript(email, (err) => {
      if (!err) {
        dispatch({
          type: EMAIL_TRANSCRIPT_SUCCESS,
          payload: email
        });
      } else {
        dispatch({
          type: EMAIL_TRANSCRIPT_FAILURE,
          payload: email
        });
      }
    });
  };
}

export function resetEmailTranscript() {
  return {
    type: RESET_EMAIL_TRANSCRIPT
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

export function chatNotificationDismissed() {
  return { type: CHAT_NOTIFICATION_DISMISSED };
}

export function chatNotificationRespond() {
  return { type: CHAT_NOTIFICATION_RESPONDED };
}

export function sendAttachment(fileList) {
  return (dispatch, getState) => {
    const visitor = getChatVisitor(getState());
    const file = fileList[0];
    const time = Date.now();

    dispatch({
      type: CHAT_FILE_REQUEST_SENT,
      payload: {
        type: 'chat.file',
        file,
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
            file,
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
  };
}

export function newAgentMessageReceived() {
  return { type: NEW_AGENT_MESSAGE_RECEIVED };
}

export function chatOpened() {
  return { type: CHAT_OPENED };
}

export function chatOfflineFormChanged(formState) {
  return {
    type: CHAT_OFFLINE_FORM_CHANGED,
    payload: formState
  };
}

export function setDepartment(departmentId, successCallback, errCallback) {
  return () => {
    zChat.setVisitorDefaultDepartment(departmentId, (err) => {
      if (!err) {
        successCallback();
      } else {
        errCallback(err);
      }
    });
  };
}
