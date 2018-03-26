const zChat = (() => { try { return require('chat-web-sdk'); } catch (_) {} })();

import {
  END_CHAT_REQUEST_SUCCESS,
  END_CHAT_REQUEST_FAILURE,
  CHAT_MSG_REQUEST_SENT,
  CHAT_MSG_REQUEST_SUCCESS,
  CHAT_MSG_REQUEST_FAILURE,
  CHAT_BOX_CHANGED,
  SET_VISITOR_INFO_REQUEST_PENDING,
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  SET_VISITOR_INFO_REQUEST_FAILURE,
  GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
  IS_CHATTING,
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
  CHAT_OFFLINE_FORM_CHANGED,
  PRE_CHAT_FORM_ON_CHANGE,
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
  OFFLINE_FORM_REQUEST_FAILURE,
  OFFLINE_FORM_REQUEST_SUCCESS,
  OFFLINE_FORM_REQUEST_SENT,
  OFFLINE_FORM_BACK_CLICKED
} from './chat-action-types';
import { PRECHAT_SCREEN, FEEDBACK_SCREEN } from './chat-screen-types';
import {
  getChatVisitor,
  getShowRatingScreen,
  getIsChatting as getIsChattingState } from 'src/redux/modules/chat/chat-selectors';
import { CHAT_MESSAGE_TYPES } from 'src/constants/chat';
import { getChatStandalone } from 'src/redux/modules/base/base-selectors';
import { mediator } from 'service/mediator';
import _ from 'lodash';

const chatTypingTimeout = 2000;

const getChatMessagePayload = (msg, visitor, timestamp) => ({
  type: 'chat.msg',
  timestamp,
  nick: visitor.nick,
  display_name: visitor.display_name,
  msg
});

const sendMsgRequest = (msg, visitor, timestamp) => {
  return {
    type: CHAT_MSG_REQUEST_SENT,
    payload: {
      ...getChatMessagePayload(msg, visitor, timestamp),
      status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING
    }
  };
};

const sendMsgSuccess = (msg, visitor, timestamp) => {
  return {
    type: CHAT_MSG_REQUEST_SUCCESS,
    payload: {
      ...getChatMessagePayload(msg, visitor, timestamp),
      status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS
    }
  };
};

const sendMsgFailure = (msg, visitor, timestamp) => {
  return {
    type: CHAT_MSG_REQUEST_FAILURE,
    payload: {
      ...getChatMessagePayload(msg, visitor, timestamp),
      status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE
    }
  };
};

export function sendMsg(msg, timestamp=Date.now()) {
  return (dispatch, getState) => {
    let visitor = getChatVisitor(getState());

    dispatch(sendMsgRequest(msg, visitor, timestamp));

    zChat.sendChatMsg(msg, (err) => {
      visitor = getChatVisitor(getState());

      if (!err) {
        dispatch(sendMsgSuccess(msg, visitor, timestamp));
      } else {
        dispatch(sendMsgFailure(msg, visitor, timestamp));
      }
    });
  };
}

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
    dispatch({ type: SET_VISITOR_INFO_REQUEST_PENDING });

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

  return (dispatch, getState) => {
    if (accountSettings.forms.pre_chat_form.required && !getIsChattingState(getState())) {
      dispatch(updateChatScreen(PRECHAT_SCREEN));
    }

    if (!accountSettings.chat_button.hide_when_offline && getChatStandalone(getState())) {
      mediator.channel.broadcast('.show');
    }

    dispatch({
      type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
      payload: accountSettings
    });
  };
}

export function getIsChatting() {
  const isChatting = zChat.isChatting();

  return {
    type: IS_CHATTING,
    payload: isChatting
  };
}

export function chatNotificationDismissed() {
  return { type: CHAT_NOTIFICATION_DISMISSED };
}

export function chatNotificationRespond() {
  return { type: CHAT_NOTIFICATION_RESPONDED };
}

export function sendAttachments(fileList) {
  return (dispatch, getState) => {
    const visitor = getChatVisitor(getState());

    _.forEach(fileList, file => {
      const basePayload = {
        type: 'chat.file',
        timestamp: Date.now(),
        nick: visitor.nick,
        display_name: visitor.display_name
      };

      dispatch({
        type: CHAT_FILE_REQUEST_SENT,
        payload: {
          ...basePayload,
          // _.assign is intentionally used here as 'file' is an instance of the
          // File class and isn't easily spread over/extended with native methods
          file: _.assign(file, {
            uploading: true
          })
        }
      });

      zChat.sendFile(file, (err, data) => {
        if (!err) {
          dispatch({
            type: CHAT_FILE_REQUEST_SUCCESS,
            payload: {
              ...basePayload,
              file: _.assign(file, {
                url: data.url,
                uploading: false
              })
            }
          });
        } else {
          dispatch({
            type: CHAT_FILE_REQUEST_FAILURE,
            payload: {
              ...basePayload,
              file: _.assign(file, {
                error: err,
                uploading: false
              })
            }
          });
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

export function handlePreChatFormChange(state) {
  return {
    type: PRE_CHAT_FORM_ON_CHANGE,
    payload: state
  };
}

export function updateContactDetailsVisibility(bool) {
  return {
    type: UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
    payload: bool
  };
}

export function handleOfflineFormBack() {
  return {
    type: OFFLINE_FORM_BACK_CLICKED
  };
}

export function handleOfflineFormSubmit(formState) {
  return (dispatch) => {
    dispatch({ type: OFFLINE_FORM_REQUEST_SENT });

    zChat.sendOfflineMsg(formState, (err) => {
      if (!err) {
        dispatch({
          type: OFFLINE_FORM_REQUEST_SUCCESS,
          payload: formState
        });
      } else {
        dispatch({ type: OFFLINE_FORM_REQUEST_FAILURE });
      }
    });
  };
}
