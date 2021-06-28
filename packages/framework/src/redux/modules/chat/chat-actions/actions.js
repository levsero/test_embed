import _ from 'lodash'

import * as actions from '../chat-action-types'
import { CHATTING_SCREEN, PRECHAT_SCREEN, POST_CHAT_SCREEN } from '../chat-screen-types'
import {
  getChatVisitor,
  getShowRatingScreen,
  getIsChatting as getIsChattingState,
  getActiveAgents,
  getIsAuthenticated,
  getZChatVendor,
  getStandaloneMobileNotificationVisible,
  getNotification,
  getPrechatFormRequired,
  getChatBanned,
} from 'src/redux/modules/chat/chat-selectors'
import { CHAT_MESSAGE_TYPES } from 'src/constants/chat'
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors'
import audio from 'service/audio'
import { getPageTitle, getHostUrl, isValidUrl } from 'src/util/utils'
import { formatSchedule } from 'src/util/chat'
import { zChatWithTimeout, canBeIgnored } from 'src/redux/modules/chat/helpers/zChatWithTimeout'
import {
  CHAT_CONNECTED_EVENT,
  CHAT_STARTED_EVENT,
  CHAT_UNREAD_MESSAGES_EVENT,
} from 'constants/event'
import * as callbacks from 'service/api/callbacks'
import zopimApi from 'service/api/zopimApi'
import { updateBackButtonVisibility, showWidget, showChat } from 'src/redux/modules/base'
import { setFormState } from 'src/redux/modules/form/actions'
import { getHelpCenterAvailable, getChannelChoiceAvailable } from 'src/redux/modules/selectors'
import { onChatSDKInitialized, onChatConnected } from 'src/service/api/zopimApi/callbacks'
import { isMobileBrowser } from 'utility/devices'
import errorTracker from 'src/framework/services/errorTracker'

const chatTypingTimeout = 2000
let history = []

const getChatMessagePayload = (msg, visitor, timestamp) => ({
  type: 'chat.msg',
  timestamp,
  nick: visitor.nick,
  display_name: visitor.display_name,
  msg,
})

const noop = () => {}

const sendMsgRequest = (msg, visitor, timestamp) => {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState())

    zChat.sendTyping(false)

    dispatch({
      type: actions.CHAT_MSG_REQUEST_SENT,
      payload: {
        detail: {
          ...getChatMessagePayload(msg, visitor, timestamp),
        },
        status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
      },
    })
  }
}

const sendMsgSuccess = (msg, visitor, timestamp) => {
  return {
    type: actions.CHAT_MSG_REQUEST_SUCCESS,
    payload: {
      detail: {
        ...getChatMessagePayload(msg, visitor, timestamp),
      },
      status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
    },
  }
}

const sendMsgFailure = (msg, visitor, timestamp) => {
  return {
    type: actions.CHAT_MSG_REQUEST_FAILURE,
    payload: {
      detail: {
        ...getChatMessagePayload(msg, visitor, timestamp),
      },
      status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
    },
  }
}

export function sendMsg(msg, timestamp = Date.now()) {
  return (dispatch, getState) => {
    onChatConnected(() => {
      let visitor = getChatVisitor(getState())

      dispatch(sendMsgRequest(msg, visitor, timestamp))

      zChatWithTimeout(getState, 'sendChatMsg')(msg, (err) => {
        visitor = getChatVisitor(getState())

        if (!err) {
          dispatch(sendMsgSuccess(msg, visitor, timestamp))
        } else {
          dispatch(sendMsgFailure(msg, visitor, timestamp))
        }
      })
    })
  }
}

export const endChat = (callback = noop) => {
  return (dispatch, getState) => {
    zChatWithTimeout(
      getState,
      'endChat'
    )((err) => {
      if (canBeIgnored(err)) {
        const activeAgents = getActiveAgents(getState())

        dispatch({
          type: actions.CHAT_ALL_AGENTS_INACTIVE,
          payload: activeAgents,
        })
        dispatch({ type: actions.END_CHAT_REQUEST_SUCCESS })
        dispatch(
          updateBackButtonVisibility(
            getHelpCenterAvailable(getState()) || getChannelChoiceAvailable(getState())
          )
        )
      } else {
        dispatch({ type: actions.END_CHAT_REQUEST_FAILURE })
      }

      callback()
    })
  }
}

export const endChatViaPostChatScreen = () => {
  return (dispatch, getState) => {
    if (getShowRatingScreen(getState())) {
      dispatch(updateChatScreen(POST_CHAT_SCREEN))
    } else {
      dispatch(endChat())
    }
  }
}

export const updateChatScreen = (screen) => {
  return {
    type: actions.UPDATE_CHAT_SCREEN,
    payload: { screen },
  }
}

export function resetCurrentMessage() {
  return {
    type: actions.RESET_CURRENT_MESSAGE,
  }
}

export function openedChatHistory() {
  return {
    type: actions.OPENED_CHAT_HISTORY,
  }
}

export function closedChatHistory() {
  return {
    type: actions.CLOSED_CHAT_HISTORY,
  }
}

const stopTypingIndicator = _.debounce((zChat) => zChat.sendTyping(false), chatTypingTimeout)

export function handleChatBoxChange(msg) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState())

    dispatch({
      type: actions.CHAT_BOX_CHANGED,
      payload: msg,
    })

    if (msg.length === 0) {
      zChat.sendTyping(false)
    } else {
      zChat.sendTyping(true)
      stopTypingIndicator(zChat)
    }
  }
}

// TODO: When tests are ported over to jest find a better way to test timestamp
// instead of passing it in and using the default for everything in prod.
export function setVisitorInfo(visitor, successAction, identifier, timestamp = Date.now()) {
  return (dispatch, getState) => {
    const state = getState()

    // if chat is banned, do not call setVisitorInfo
    if (getChatBanned(state)) {
      return
    }
    const isAuthenticated = getIsAuthenticated(state)

    let infoToUpdate = { ...visitor }

    // If the user is authenticated, we still allow the phone number to be updated.
    // This is due to the JWT token not supporting providing a phone number in there at the moment.
    if (isAuthenticated) {
      if (!visitor.phone) {
        return
      }

      infoToUpdate = { phone: visitor.phone }
    }

    dispatch({
      type: actions.SET_VISITOR_INFO_REQUEST_PENDING,
      payload: { ...infoToUpdate, timestamp },
    })
    return new Promise((res, rej) => {
      onChatSDKInitialized(() => {
        zChatWithTimeout(getState, 'setVisitorInfo')(infoToUpdate, (err) => {
          if (!err) {
            dispatch({
              type: actions.SET_VISITOR_INFO_REQUEST_SUCCESS,
              payload: { ...infoToUpdate, timestamp },
            })
            if (_.isObjectLike(successAction)) dispatch(successAction)
            res()
          } else {
            dispatch({ type: actions.SET_VISITOR_INFO_REQUEST_FAILURE })

            rej(err)
          }
        })
      })
    }).catch((err) => {
      errorTracker.error(err || new Error('Unknown reason'), {
        rollbarFingerprint: `Failed to set user information while starting chat ${identifier}`,
        rollbarTitle: `Failed to set user information while starting chat ${identifier}`,
      })
      dispatch({ type: actions.SET_VISITOR_INFO_REQUEST_FAILURE })
    })
  }
}

export function editContactDetailsSubmitted(visitor) {
  const successAction = {
    type: actions.CHAT_CONTACT_DETAILS_UPDATE_SUCCESS,
    payload: { ...visitor, timestamp: Date.now() },
  }

  return setVisitorInfo(visitor, successAction, 'edit contact details')
}

export function sendVisitorPath(options = {}) {
  return (dispatch, getState) => {
    onChatConnected(() => {
      const zChat = getZChatVendor(getState())
      let page = {}

      page.title = options.title && _.isString(options.title) ? options.title : getPageTitle()
      page.url = isValidUrl(options.url) ? options.url : getHostUrl()

      if (!page.title) page.title = page.url

      zChat.sendVisitorPath(page, (err) => {
        if (!err) {
          dispatch({
            type: actions.SEND_VISITOR_PATH_REQUEST_SUCCESS,
            payload: page,
          })
        } else {
          dispatch({ type: actions.SEND_VISITOR_PATH_REQUEST_FAILURE })
        }
      })
    })
  }
}

export function resetEmailTranscript() {
  return {
    type: actions.RESET_EMAIL_TRANSCRIPT,
  }
}

export function sendChatRating(rating = null) {
  return (dispatch, getState) => {
    zChatWithTimeout(getState, 'sendChatRating')(rating, (err) => {
      if (canBeIgnored(err)) {
        dispatch({
          type: actions.CHAT_RATING_REQUEST_SUCCESS,
          payload: rating,
        })
      } else {
        dispatch({ type: actions.CHAT_RATING_REQUEST_FAILURE })
      }
    })
  }
}

export function sendChatComment(comment = '') {
  return (dispatch, getState) => {
    zChatWithTimeout(getState, 'sendChatComment')(comment, (err) => {
      if (canBeIgnored(err)) {
        dispatch({
          type: actions.CHAT_RATING_COMMENT_REQUEST_SUCCESS,
          payload: comment,
        })
      } else {
        dispatch({ type: actions.CHAT_RATING_COMMENT_REQUEST_FAILURE })
      }
    })
  }
}

export function sendLastChatRatingInfo(lastChatRatingInfo = {}) {
  return (dispatch, getState) => {
    zChatWithTimeout(getState, 'sendLastChatRatingInfo')(lastChatRatingInfo, (err) => {
      if (canBeIgnored(err)) {
        if ('rating' in lastChatRatingInfo) {
          dispatch({
            type: actions.CHAT_RATING_REQUEST_SUCCESS,
            payload: lastChatRatingInfo.rating,
          })
        }

        if ('comment' in lastChatRatingInfo) {
          dispatch({
            type: actions.CHAT_RATING_COMMENT_REQUEST_SUCCESS,
            payload: lastChatRatingInfo.comment,
          })
        }
      } else {
        // Follow existing chat rating error handling
        dispatch({ type: actions.CHAT_RATING_REQUEST_FAILURE })
        dispatch({ type: actions.CHAT_RATING_COMMENT_REQUEST_FAILURE })
      }

      // To reset rating state after sending last chat rating. We will handle
      // retry and failure logic for chat rating in https://zendesk.atlassian.net/browse/POLO-2100
      // For now, last chat rating will fail silently, similar to existing chat rating
      dispatch({ type: actions.CHAT_LAST_CHAT_RATING_REQUEST_COMPLETE })
    })
  }
}

const loadAudio = () => {
  try {
    import(
      /* webpackChunkName: 'chat-incoming-message-notification' */ 'src/asset/media/chat-incoming-message-notification.mp3'
    ).then((thing) => {
      audio.load('incoming_message', thing.default)
    })
  } catch (_) {}
}

export function getAccountSettings() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState())
    const accountSettings = zChat.getAccountSettings()

    if (accountSettings.forms.pre_chat_form.required && !getIsChattingState(getState())) {
      dispatch(updateChatScreen(PRECHAT_SCREEN))
    }

    if (!accountSettings.sound.disabled) {
      loadAudio()
    }

    dispatch({
      type: actions.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
      payload: accountSettings,
    })
  }
}

export function getOperatingHours() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState())
    const operatingHours = zChat.getOperatingHours()

    if (operatingHours) {
      const { type, timezone, enabled } = operatingHours

      if (!enabled)
        return dispatch({
          type: actions.GET_OPERATING_HOURS_REQUEST_SUCCESS,
          payload: { enabled },
        })

      const formattedOperatingHours = {
        ...operatingHours,
        type,
        enabled,
        timezone: timezone.replace(/_/g, ' '),
        ...(type === 'account'
          ? {
              account_schedule: formatSchedule(operatingHours.account_schedule),
            }
          : {
              department_schedule: _.mapValues(operatingHours.department_schedule, formatSchedule),
            }),
      }

      dispatch({
        type: actions.GET_OPERATING_HOURS_REQUEST_SUCCESS,
        payload: formattedOperatingHours,
      })
    }
  }
}

export function chatNotificationTimedOut() {
  return (dispatch, getState) => {
    const state = getState()
    const { show } = getNotification(state)

    if (getStandaloneMobileNotificationVisible(state)) {
      dispatch(proactiveChatNotificationDismissed())
    } else if (show) {
      dispatch(chatNotificationDismissed())
    }
  }
}

export function chatNotificationDismissed() {
  return { type: actions.CHAT_NOTIFICATION_DISMISSED }
}

export function proactiveChatNotificationDismissed() {
  return { type: actions.PROACTIVE_CHAT_NOTIFICATION_DISMISSED }
}

export function chatNotificationRespond() {
  return { type: actions.CHAT_NOTIFICATION_RESPONDED }
}

export function chatNotificationReset() {
  return { type: actions.CHAT_NOTIFICATION_RESET }
}

export function sendAttachments(fileList) {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState())
    const visitor = getChatVisitor(getState())

    _.forEach(fileList, (file) => {
      const basePayload = {
        type: 'chat.file',
        timestamp: Date.now(),
        nick: visitor.nick,
        display_name: visitor.display_name,
      }

      dispatch({
        type: actions.CHAT_FILE_REQUEST_SENT,
        payload: {
          detail: {
            ...basePayload,
            // _.assign is intentionally used here as 'file' is an instance of the
            // File class and isn't easily spread over/extended with native methods
            file: _.assign(file, {
              uploading: true,
            }),
          },
        },
      })

      zChat.sendFile(file, (err, data) => {
        if (!err) {
          dispatch({
            type: actions.CHAT_FILE_REQUEST_SUCCESS,
            payload: {
              detail: {
                ...basePayload,
                file: _.assign(file, {
                  url: data.url,
                  uploading: false,
                }),
              },
            },
          })
        } else {
          dispatch({
            type: actions.CHAT_FILE_REQUEST_FAILURE,
            payload: {
              detail: {
                ...basePayload,
                file: _.assign(file, {
                  error: err,
                  uploading: false,
                }),
              },
            },
          })
        }
      })
    })
  }
}

export function newAgentMessageReceived(chat) {
  return (dispatch) => {
    dispatch({ type: actions.NEW_AGENT_MESSAGE_RECEIVED, payload: chat })
    callbacks.fireFor(CHAT_UNREAD_MESSAGES_EVENT)
  }
}

export function chatOpened() {
  return { type: actions.CHAT_OPENED }
}

export function chatBanned() {
  return { type: actions.CHAT_BANNED }
}

export function chatDropped() {
  return { type: actions.CHAT_DROPPED }
}

export function chatConnectionError() {
  return { type: actions.CHAT_CONNECTION_ERROR }
}

export function chatOfflineFormChanged(formState) {
  return {
    type: actions.CHAT_OFFLINE_FORM_CHANGED,
    payload: formState,
  }
}

export function setDepartment(departmentId, successCallback = noop, errCallback = noop) {
  return (dispatch, getState) => {
    zChatWithTimeout(getState, 'setVisitorDefaultDepartment')(departmentId, (err) => {
      dispatch(setDefaultDepartment(departmentId, Date.now()))

      if (!err) {
        successCallback()
      } else {
        errCallback(err)
      }
    })
  }
}

export function clearDepartment(successCallback = noop) {
  return (_dispatch, getState) => {
    zChatWithTimeout(
      getState,
      'clearVisitorDefaultDepartment'
    )((_error) => {
      successCallback()
    })
  }
}

export function handlePreChatFormChange(state) {
  return {
    type: actions.PRE_CHAT_FORM_ON_CHANGE,
    payload: state,
  }
}

export function handleChatBadgeMessageChange(message) {
  return {
    type: actions.CHAT_BADGE_MESSAGE_CHANGED,
    payload: message,
  }
}

export function updateContactDetailsVisibility(bool) {
  return {
    type: actions.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
    payload: bool,
  }
}

export function updateEmailTranscriptVisibility(bool) {
  return {
    type: actions.UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
    payload: bool,
  }
}

export function updateContactDetailsFields(state) {
  return {
    type: actions.UPDATE_CHAT_CONTACT_DETAILS_INFO,
    payload: state,
  }
}

export function handleOfflineFormBack() {
  return {
    type: actions.OFFLINE_FORM_BACK_BUTTON_CLICKED,
  }
}

export function handleOperatingHoursClick() {
  return {
    type: actions.OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED,
  }
}

export function sendOfflineMessage(formState, successCallback = noop, failureCallback = noop) {
  return (dispatch, getState) => {
    dispatch({ type: actions.OFFLINE_FORM_REQUEST_SENT })

    const offlineFormState = { ...formState }

    if (!offlineFormState.phone) {
      delete offlineFormState.phone
    }

    zChatWithTimeout(getState, 'sendOfflineMsg')(offlineFormState, (err) => {
      if (!err) {
        dispatch({
          type: actions.OFFLINE_FORM_REQUEST_SUCCESS,
          payload: offlineFormState,
        })
        dispatch(setFormState('offline-form', { ...offlineFormState, message: '' }))
        successCallback()
      } else {
        dispatch({ type: actions.OFFLINE_FORM_REQUEST_FAILURE })
        failureCallback()
      }
    })
  }
}

export function handleReconnect() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState())

    zChat.reconnect()

    dispatch({
      type: actions.CHAT_RECONNECT,
    })
  }
}

export function showStandaloneMobileNotification() {
  return { type: actions.SHOW_STANDALONE_MOBILE_NOTIFICATION }
}

export const fetchConversationHistory = () => {
  return (dispatch, getState) => {
    dispatch({ type: actions.HISTORY_REQUEST_SENT })

    zChatWithTimeout(
      getState,
      'fetchChatHistory'
    )((err, data) => {
      /*
        This callback is invoked either when the API errors out or
        after the next batch of history messages has been passed into firehose.
      */

      if (canBeIgnored(err)) {
        dispatch({
          type: actions.HISTORY_REQUEST_SUCCESS,
          payload: { ...data, history },
        })
      } else {
        dispatch({
          type: actions.HISTORY_REQUEST_FAILURE,
          payload: err,
        })
      }

      history = []
    })
  }
}

export const updatePreviewerScreen = (screen) => {
  return {
    type: actions.UPDATE_PREVIEWER_SCREEN,
    payload: screen,
  }
}

export const updatePreviewerSettings = (settings) => {
  return {
    type: actions.UPDATE_PREVIEWER_SETTINGS,
    payload: settings,
  }
}

export function initiateSocialLogout() {
  return (dispatch, getState) => {
    dispatch({ type: actions.CHAT_SOCIAL_LOGOUT_PENDING })

    zChatWithTimeout(
      getState,
      'doAuthLogout',
      10000
    )((err) => {
      if (!err) {
        dispatch({ type: actions.CHAT_SOCIAL_LOGOUT_SUCCESS })
      } else {
        dispatch({ type: actions.CHAT_SOCIAL_LOGOUT_FAILURE })
      }
    })
  }
}

export function handlePrechatFormSubmit(info) {
  return {
    type: actions.PRE_CHAT_FORM_SUBMIT,
    payload: info,
  }
}

export function handleChatVendorLoaded(vendor) {
  return {
    type: actions.CHAT_VENDOR_LOADED,
    payload: vendor,
  }
}

export function proactiveMessageReceived() {
  return (dispatch) => {
    dispatch({ type: actions.PROACTIVE_CHAT_RECEIVED })
    dispatch(showWidget())
    dispatch(showChat({ proactive: true }))

    if (isMobileBrowser()) {
      dispatch(showStandaloneMobileNotification())
    }
  }
}

export function chatWindowOpenOnNavigate() {
  return {
    type: actions.CHAT_WINDOW_OPEN_ON_NAVIGATE,
  }
}

export function chatStarted() {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({ type: actions.CHAT_STARTED })
    // Proactive chats are handled seperately by checking when chat loads if it
    // should show so this is only needed if the user starts a chat.
    if (getActiveEmbed(state) === 'chat') {
      dispatch(updateBackButtonVisibility(getHelpCenterAvailable(state)))
    }
    callbacks.fireFor(CHAT_STARTED_EVENT)
  }
}

export function chatConnected() {
  return (dispatch) => {
    zopimApi.handleChatConnected()
    dispatch({
      type: actions.CHAT_CONNECTED,
    })
    callbacks.fireFor(CHAT_CONNECTED_EVENT)
  }
}

export function setStatusForcefully(status) {
  return {
    type: actions.API_FORCE_STATUS_CALLED,
    payload: status,
  }
}

export function markAsRead() {
  return (dispatch, getState) => {
    const state = getState()
    const zChat = getZChatVendor(state)

    zChat.markAsRead()

    dispatch(chatNotificationReset())
  }
}

export function setDefaultDepartment(id, timestamp) {
  return {
    type: actions.VISITOR_DEFAULT_DEPARTMENT_SELECTED,
    payload: {
      timestamp,
      department: id,
    },
  }
}

export function updateEndChatModalVisibility(isVisible) {
  return {
    type: actions.UPDATE_END_CHAT_MODAL_VISIBILITY,
    payload: {
      isVisible,
    },
  }
}

export function sendChatBadgeMessage(message) {
  return (dispatch, getState) => {
    onChatConnected(() => {
      const prechatFormRequired = getPrechatFormRequired(getState())
      const nextScreen = prechatFormRequired ? PRECHAT_SCREEN : CHATTING_SCREEN

      dispatch(updateChatScreen(nextScreen))

      if (!prechatFormRequired) {
        dispatch(sendMsg(message))
        dispatch(resetCurrentMessage())
      }
    })
  }
}
