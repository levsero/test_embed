import * as actions from './chat-action-types';
import { PRECHAT_SCREEN, FEEDBACK_SCREEN } from './chat-screen-types';
import {
  getChatVisitor,
  getShowRatingScreen,
  getIsChatting as getIsChattingState,
  getChatOnline,
  getActiveAgents,
  getIsAuthenticated,
  getIsLoggingOut,
  getZChatVendor } from 'src/redux/modules/chat/chat-selectors';
import {
  CHAT_MESSAGE_TYPES,
  AGENT_BOT,
  EVENT_TRIGGER,
  CONNECTION_STATUSES } from 'src/constants/chat';
import {
  getChatStandalone,
  getZChatConfig } from 'src/redux/modules/base/base-selectors';
import { mediator } from 'service/mediator';
import { audio } from 'service/audio';
import _ from 'lodash';
import zChatWithTimeout from 'src/redux/modules/chat/helpers/zChatWithTimeout';
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
      type: actions.CHAT_MSG_REQUEST_SENT,
      payload: {
        ...getChatMessagePayload(msg, visitor, timestamp),
        status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING
      }
    });
  };
};

const sendMsgSuccess = (msg, visitor, timestamp) => {
  return {
    type: actions.CHAT_MSG_REQUEST_SUCCESS,
    payload: {
      ...getChatMessagePayload(msg, visitor, timestamp),
      status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS
    }
  };
};

const sendMsgFailure = (msg, visitor, timestamp) => {
  return {
    type: actions.CHAT_MSG_REQUEST_FAILURE,
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

    zChatWithTimeout(getState, 'sendChatMsg')(msg, (err) => {
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

        dispatch({ type: actions.CHAT_ALL_AGENTS_INACTIVE, payload: activeAgents });
        dispatch({ type: actions.END_CHAT_REQUEST_SUCCESS });
      } else {
        dispatch({ type: actions.END_CHAT_REQUEST_FAILURE });
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
    type: actions.UPDATE_CHAT_SCREEN,
    payload: { screen }
  };
};

export const handleSoundIconClick = (settings) => {
  return {
    type: actions.SOUND_ICON_CLICKED,
    payload: settings
  };
};

export function resetCurrentMessage() {
  return {
    type: actions.RESET_CURRENT_MESSAGE
  };
}

const stopTypingIndicator = _.debounce((zChat) => zChat.sendTyping(false), chatTypingTimeout);

export function handleChatBoxChange(msg) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({
      type: actions.CHAT_BOX_CHANGED,
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
        type: actions.SET_VISITOR_INFO_REQUEST_PENDING,
        payload: { ...visitor, timestamp }
      });

      zChat && zChat.setVisitorInfo(visitor, (err) => {
        if (!err) {
          dispatch({
            type: actions.SET_VISITOR_INFO_REQUEST_SUCCESS,
            payload: { ...visitor, timestamp }
          });
        } else {
          dispatch({ type: actions.SET_VISITOR_INFO_REQUEST_FAILURE });
        }
      });
    }
  };
}

export function sendVisitorPath(page = {}) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    zChat && zChat.sendVisitorPath(page, (err) => {
      if (!err) {
        dispatch({
          type: actions.SEND_VISITOR_PATH_REQUEST_SUCCESS,
          payload: page
        });
      } else {
        dispatch({ type: actions.SEND_VISITOR_PATH_REQUEST_FAILURE });
      }
    });
  };
}

export function sendEmailTranscript(email) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({
      type: actions.EMAIL_TRANSCRIPT_REQUEST_SENT,
      payload: email
    });

    zChat.sendEmailTranscript(email, (err) => {
      if (!err) {
        dispatch({
          type: actions.EMAIL_TRANSCRIPT_SUCCESS,
          payload: email
        });
      } else {
        dispatch({
          type: actions.EMAIL_TRANSCRIPT_FAILURE,
          payload: email
        });
      }
    });
  };
}

export function resetEmailTranscript() {
  return {
    type: actions.RESET_EMAIL_TRANSCRIPT
  };
}

export function sendChatRating(rating = null) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.sendChatRating(rating, (err) => {
      if (!err) {
        dispatch({
          type: actions.CHAT_RATING_REQUEST_SUCCESS,
          payload: rating
        });
      } else {
        dispatch({ type: actions.CHAT_RATING_REQUEST_FAILURE });
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
          type: actions.CHAT_RATING_COMMENT_REQUEST_SUCCESS,
          payload: comment
        });
      } else {
        dispatch({ type: actions.CHAT_RATING_COMMENT_REQUEST_FAILURE });
      }
    });
  };
}

const loadAudio = () => {
  try {
    audio.load('incoming_message', 'https://v2.zopim.com/widget/sounds/triad_gbd');
  } catch (_) { }
};

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

    if (!accountSettings.sound.disabled) {
      loadAudio();
    }

    dispatch({
      type: actions.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
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
        type: actions.GET_OPERATING_HOURS_REQUEST_SUCCESS,
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
      type: actions.IS_CHATTING,
      payload: isChatting
    });
  };
}

export function chatNotificationDismissed() {
  return { type: actions.CHAT_NOTIFICATION_DISMISSED };
}

export function chatNotificationRespond() {
  return { type: actions.CHAT_NOTIFICATION_RESPONDED };
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
        type: actions.CHAT_FILE_REQUEST_SENT,
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
            type: actions.CHAT_FILE_REQUEST_SUCCESS,
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
            type: actions.CHAT_FILE_REQUEST_FAILURE,
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
  return { type: actions.NEW_AGENT_MESSAGE_RECEIVED, payload: chat };
}

export function chatOpened() {
  return { type: actions.CHAT_OPENED };
}

export function chatOfflineFormChanged(formState) {
  return {
    type: actions.CHAT_OFFLINE_FORM_CHANGED,
    payload: formState
  };
}

export function setDepartment(departmentId, successCallback, errCallback) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.setVisitorDefaultDepartment(departmentId, (err) => {
      dispatch({
        type: actions.VISITOR_DEFAULT_DEPARTMENT_SELECTED,
        payload: {
          department: departmentId
        }
      });

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
    type: actions.PRE_CHAT_FORM_ON_CHANGE,
    payload: state
  };
}

export function updateContactDetailsVisibility(bool) {
  return {
    type: actions.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
    payload: bool
  };
}

export function updateEmailTranscriptVisibility(bool) {
  return {
    type: actions.UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
    payload: bool
  };
}

export function handleOfflineFormBack() {
  return {
    type: actions.OFFLINE_FORM_BACK_BUTTON_CLICKED
  };
}

export function handleOperatingHoursClick() {
  return {
    type: actions.OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED
  };
}

export function sendOfflineMessage(
  formState,
  successCallback = () => {},
  failureCallback = () => {}) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({ type: actions.OFFLINE_FORM_REQUEST_SENT });

    zChat.sendOfflineMsg(formState, (err) => {
      if (!err) {
        dispatch({
          type: actions.OFFLINE_FORM_REQUEST_SUCCESS,
          payload: formState
        });
        successCallback();
      } else {
        dispatch({ type: actions.OFFLINE_FORM_REQUEST_FAILURE });
        failureCallback();
      }
    });
  };
}

export function updateMenuVisibility(visible) {
  return {
    type: actions.UPDATE_CHAT_MENU_VISIBILITY,
    payload: visible
  };
}

export function handleReconnect() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    zChat.reconnect();

    dispatch({
      type: actions.CHAT_RECONNECT
    });
  };
}

export function updateLastAgentMessageSeenTimestamp(timestamp) {
  return {
    type: actions.UPDATE_LAST_AGENT_MESSAGE_SEEN_TIMESTAMP,
    payload: timestamp
  };
}

export function showStandaloneMobileNotification() {
  return { type: actions.SHOW_STANDALONE_MOBILE_NOTIFICATION };
}

export const fetchConversationHistory = () => {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({ type: actions.HISTORY_REQUEST_SENT });

    zChat.fetchChatHistory((err, data) => {
      /*
        This callback is invoked either when the API errors out or
        after the next batch of history messages has been passed into firehose.
      */
      if (err) {
        dispatch({
          type: actions.HISTORY_REQUEST_FAILURE,
          payload: err
        });
      } else {
        dispatch({
          type: actions.HISTORY_REQUEST_SUCCESS,
          payload: { ...data, history }
        });
      }

      history = [];
    });
  };
};

export const updatePreviewerScreen = (screen) => {
  return {
    type: actions.UPDATE_PREVIEWER_SCREEN,
    payload: screen
  };
};

export const updatePreviewerSettings = (settings) => {
  return {
    type: actions.UPDATE_PREVIEWER_SETTINGS,
    payload: settings
  };
};

export function initiateSocialLogout() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState());

    dispatch({ type: actions.CHAT_SOCIAL_LOGOUT_PENDING });

    zChat.doAuthLogout((err) => {
      (err)
        ? dispatch({ type: actions.CHAT_SOCIAL_LOGOUT_FAILURE })
        : dispatch({ type: actions.CHAT_SOCIAL_LOGOUT_SUCCESS });
    });
  };
}

export function handlePrechatFormSubmit(info) {
  return {
    type: actions.PRE_CHAT_FORM_SUBMIT,
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
          type: actions.CHAT_USER_LOGGING_OUT
        });

        zChat.logout();
        zChat.init(zChatConfig);
        zChat.on('connection_update', (connectionStatus) => {
          const isLoggingOut = getIsLoggingOut(getState());

          if (connectionStatus === CONNECTION_STATUSES.CONNECTED && isLoggingOut) {
            dispatch({
              type: actions.CHAT_USER_LOGGED_OUT
            });
          }
        });
      });
    }
  };
}

export function handleChatVendorLoaded(vendor) {
  return {
    type: actions.CHAT_VENDOR_LOADED,
    payload: vendor
  };
}

export function proactiveMessageRecieved() {
  return {
    type: actions.PROACTIVE_CHAT_RECEIVED
  };
}

export function chatWindowOpenOnNavigate() {
  return {
    type: actions.CHAT_WINDOW_OPEN_ON_NAVIGATE
  };
}

export function chatConnected() {
  return {
    type: actions.CHAT_CONNECTED
  };
}

// TODO: Remove this function.
// It was added temporarily when transitioning to use dynamic import()
// for the chat-web-sdk
export function setChatHistoryHandler() {
  return (_, getState) => {
    const zChat = getZChatVendor(getState());

    zChat && zChat.on('history', (data) => {
      const eventData = (data.nick === EVENT_TRIGGER)
        ? { ...data, nick: AGENT_BOT }
        : data;
      const newEntry = [eventData.timestamp, eventData];

      history.unshift(newEntry);
    });
  };
}
