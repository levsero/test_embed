import {
  UPDATE_PREVIEWER_SCREEN,
  UPDATE_PREVIEWER_SETTINGS,
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
  GET_OPERATING_HOURS_REQUEST_SUCCESS,
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
  PRE_CHAT_FORM_SUBMIT,
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
  UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
  UPDATE_CHAT_MENU_VISIBILITY,
  OFFLINE_FORM_REQUEST_FAILURE,
  OFFLINE_FORM_REQUEST_SUCCESS,
  OFFLINE_FORM_REQUEST_SENT,
  OFFLINE_FORM_BACK_BUTTON_CLICKED,
  OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED,
  CHAT_RECONNECT,
  UPDATE_LAST_AGENT_MESSAGE_SEEN_TIMESTAMP,
  RESET_CURRENT_MESSAGE,
  SHOW_STANDALONE_MOBILE_NOTIFICATION,
  CHAT_ALL_AGENTS_INACTIVE,
  HISTORY_REQUEST_SENT,
  HISTORY_REQUEST_SUCCESS,
  HISTORY_REQUEST_FAILURE,
  CHAT_SOCIAL_LOGOUT_PENDING,
  CHAT_SOCIAL_LOGOUT_SUCCESS,
  CHAT_SOCIAL_LOGOUT_FAILURE,
  CHAT_VENDOR_LOADED,
  CHAT_USER_LOGGING_OUT,
  CHAT_USER_LOGGED_OUT
} from './chat-action-types';
import { PRECHAT_SCREEN, FEEDBACK_SCREEN } from './chat-screen-types';
import {
  getChatVisitor,
  getShowRatingScreen,
  getIsChatting as getIsChattingState,
  getChatOnline,
  getActiveAgents,
  getIsAuthenticated,
  getZChatVendor,
  getIsLoggingOut } from 'src/redux/modules/chat/chat-selectors';
import {
  CHAT_MESSAGE_TYPES,
  AGENT_BOT,
  EVENT_TRIGGER,
  CONNECTION_STATUSES } from 'src/constants/chat';
import {
  getChatStandalone,
  getZChatConfig } from 'src/redux/modules/base/base-selectors';
import { mediator } from 'service/mediator';
import _ from 'lodash';

const chatTypingTimeout = 2000;
let history = [];

const getChatMessagePayload = (msg, visitor, timestamp) => ({
  type: 'chat.msg',
  timestamp,
  nick: visitor.nick,
  display_name: visitor.display_name,
  msg
});

const sendMsgRequest = (msg, visitor, timestamp) => {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.sendTyping(false);

    dispatch({
      type: CHAT_MSG_REQUEST_SENT,
      payload: {
        ...getChatMessagePayload(msg, visitor, timestamp),
        status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING
      }
    });
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
    const zChat = getZChatVendor(getState());

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

export const endChat = (callback=() => {}) => {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.endChat((err) => {
      if (!err) {
        const activeAgents = getActiveAgents(getState());

        dispatch({ type: CHAT_ALL_AGENTS_INACTIVE, payload: activeAgents });
        dispatch({ type: END_CHAT_REQUEST_SUCCESS });
      } else {
        dispatch({ type: END_CHAT_REQUEST_FAILURE });
      }

      callback();
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

export function resetCurrentMessage() {
  return {
    type: RESET_CURRENT_MESSAGE
  };
}

const stopTypingIndicator = _.debounce((zChat) => zChat.sendTyping(false), chatTypingTimeout);

export function handleChatBoxChange(msg) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({
      type: CHAT_BOX_CHANGED,
      payload: msg
    });

    if (msg.length === 0) {
      zChat.sendTyping(false);
    } else {
      zChat.sendTyping(true);
      stopTypingIndicator(zChat);
    }
  };
}

export function setVisitorInfo(visitor, timestamp=Date.now()) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    if (!getIsAuthenticated(getState())) {
      dispatch({
        type: SET_VISITOR_INFO_REQUEST_PENDING,
        payload: { ...visitor, timestamp }
      });

      zChat && zChat.setVisitorInfo(visitor, (err) => {
        if (!err) {
          dispatch({
            type: SET_VISITOR_INFO_REQUEST_SUCCESS,
            payload: { ...visitor, timestamp }
          });
        } else {
          dispatch({ type: SET_VISITOR_INFO_REQUEST_FAILURE });
        }
      });
    }
  };
}

export function sendEmailTranscript(email) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

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
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

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
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

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
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());
    const accountSettings = zChat.getAccountSettings();

    if (accountSettings.forms.pre_chat_form.required && !getIsChattingState(getState())) {
      dispatch(updateChatScreen(PRECHAT_SCREEN));
    }

    if (!accountSettings.chat_button.hide_when_offline && getChatStandalone(getState()) && !getChatOnline(getState())) {
      mediator.channel.broadcast('newChat.offlineFormOn');
    }

    dispatch({
      type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
      payload: accountSettings
    });
  };
}

export function getOperatingHours() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());
    const operatingHours = zChat.getOperatingHours();

    if (operatingHours) {
      dispatch({
        type: GET_OPERATING_HOURS_REQUEST_SUCCESS,
        payload: operatingHours
      });
    }
  };
}

export function getIsChatting() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());
    const isChatting = zChat.isChatting();

    dispatch({
      type: IS_CHATTING,
      payload: isChatting
    });
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
    const zChat = getZChatVendor(getState());
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

export function newAgentMessageReceived(chat) {
  return { type: NEW_AGENT_MESSAGE_RECEIVED, payload: chat };
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
  return (_, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.setVisitorDefaultDepartment(departmentId, (err) => {
      if (!err) {
        successCallback();
      } else {
        errCallback(err);
      }
    });
  };
}

export function clearDepartment(successCallback = () => {}) {
  return (_, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.clearVisitorDefaultDepartment(() => {
      successCallback();
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

export function updateEmailTranscriptVisibility(bool) {
  return {
    type: UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
    payload: bool
  };
}

export function handleOfflineFormBack() {
  return {
    type: OFFLINE_FORM_BACK_BUTTON_CLICKED
  };
}

export function handleOperatingHoursClick() {
  return {
    type: OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED
  };
}

export function sendOfflineMessage(
  formState,
  successCallback = () => {},
  failureCallback = () => {}) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({ type: OFFLINE_FORM_REQUEST_SENT });

    zChat.sendOfflineMsg(formState, (err) => {
      if (!err) {
        dispatch({
          type: OFFLINE_FORM_REQUEST_SUCCESS,
          payload: formState
        });
        successCallback();
      } else {
        dispatch({ type: OFFLINE_FORM_REQUEST_FAILURE });
        failureCallback();
      }
    });
  };
}

export function updateMenuVisibility(visible) {
  return {
    type: UPDATE_CHAT_MENU_VISIBILITY,
    payload: visible
  };
}

export function handleReconnect() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.reconnect();

    dispatch({
      type: CHAT_RECONNECT
    });
  };
}

export function updateLastAgentMessageSeenTimestamp(timestamp) {
  return {
    type: UPDATE_LAST_AGENT_MESSAGE_SEEN_TIMESTAMP,
    payload: timestamp
  };
}

export function showStandaloneMobileNotification() {
  return { type: SHOW_STANDALONE_MOBILE_NOTIFICATION };
}

export const fetchConversationHistory = () => {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({ type: HISTORY_REQUEST_SENT });

    zChat.fetchChatHistory((err, data) => {
      /*
        This callback is invoked either when the API errors out or
        after the next batch of history messages has been passed into firehose.
      */
      if (err) {
        dispatch({
          type: HISTORY_REQUEST_FAILURE,
          payload: err
        });
      } else {
        dispatch({
          type: HISTORY_REQUEST_SUCCESS,
          payload: { ...data, history }
        });
      }

      history = [];
    });
  };
};

export const updatePreviewerScreen = (screen) => {
  return {
    type: UPDATE_PREVIEWER_SCREEN,
    payload: screen
  };
};

export const updatePreviewerSettings = (settings) => {
  return {
    type: UPDATE_PREVIEWER_SETTINGS,
    payload: settings
  };
};

export function initiateSocialLogout() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({ type: CHAT_SOCIAL_LOGOUT_PENDING });

    zChat.doAuthLogout((err) => {
      (err)
        ? dispatch({ type: CHAT_SOCIAL_LOGOUT_FAILURE })
        : dispatch({ type: CHAT_SOCIAL_LOGOUT_SUCCESS });
    });
  };
}

export function handlePrechatFormSubmit(info) {
  return {
    type: PRE_CHAT_FORM_SUBMIT,
    payload: info
  };
}

export function chatLogout() {
  return (dispatch, getState) => {
    const state = getState();
    const zChat = getZChatVendor(state);
    const isAuthenticated = getIsAuthenticated(state);
    const zChatConfig = getZChatConfig(state);

    if (isAuthenticated) {
      zChat.endChat(() => {
        dispatch({
          type: CHAT_USER_LOGGING_OUT
        });

        zChat.logout();
        zChat.init(zChatConfig);
        zChat.on('connection_update', (connectionStatus) => {
          const isLoggingOut = getIsLoggingOut(getState());

          if (connectionStatus === CONNECTION_STATUSES.CONNECTED && isLoggingOut) {
            dispatch({
              type: CHAT_USER_LOGGED_OUT
            });
          }
        });
      });
    }
  };
}

export function handleChatVendorLoaded(vendor) {
  return {
    type: CHAT_VENDOR_LOADED,
    payload: vendor
  };
}

// TODO: Remove this function.
// It was added temporarily when transitioning to use dynamic import()
// for the chat-web-sdk
export function setChatHistoryHandler() {
  return (_, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.on('history', (data) => {
      const eventData = (data.nick === EVENT_TRIGGER)
        ? { ...data, nick: AGENT_BOT }
        : data;
      const newEntry = [eventData.timestamp, eventData];

      history.unshift(newEntry);
    });
  };
}
