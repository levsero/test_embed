import { TALK_SUCCESS_DONE_BUTTON_CLICKED } from 'classicSrc/embeds/talk/action-types'
import {
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
  TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
  TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
  TALK_DISCONNECT_SOCKET_EVENT,
  UPDATE_CALLBACK_FORM,
  TALK_CALLBACK_REQUEST,
  TALK_CALLBACK_SUCCESS,
  TALK_CALLBACK_FAILURE,
  TALK_VENDOR_LOADED,
  RECEIVED_DEFERRED_TALK_STATUS,
} from 'classicSrc/embeds/talk/action-types'
import {
  BASE_TALK_POLL_INTERVAL,
  MAX_TALK_POLL_INTERVAL,
  REQUESTS_BEFORE_BACKOFF,
} from 'classicSrc/embeds/talk/constants'
import { getFormState, getIsPollingTalk } from 'classicSrc/embeds/talk/selectors'
import { handleCloseButtonClicked, updateBackButtonVisibility } from 'classicSrc/redux/modules/base'
import {
  getTalkEnabled,
  getTalkNickname,
  getTalkServiceUrl,
  getDeferredTalkApiUrl,
} from 'classicSrc/redux/modules/selectors'
import { http, socketio } from 'classicSrc/service/transport'
import wait from 'classicSrc/util/wait'
import _ from 'lodash'
import { parseUrl, errorTracker } from '@zendesk/widget-shared-services'
import {
  MICROPHONE_MUTED,
  MICROPHONE_UNMUTED,
  RECORDING_CONSENT_ACCEPTED,
  RECORDING_CONSENT_DENIED,
  CALL_ENDED,
  CALL_FAILED,
  CALL_STARTED,
  RESET_CALL_FAILED,
  INCREMENT_CALL_TIMER,
} from './action-types'

let callInterval

const startCallCounter = () => (dispatch) => {
  if (!callInterval) {
    callInterval = setInterval(() => {
      dispatch({ type: INCREMENT_CALL_TIMER })
    }, 1000)
  }
}

const stopCallCounter = () => {
  clearInterval(callInterval)
  callInterval = null
}

export const muteMicrophone = () => ({
  type: MICROPHONE_MUTED,
})

export const unmuteMicrophone = () => ({
  type: MICROPHONE_UNMUTED,
})

export const acceptRecordingConsent = () => ({
  type: RECORDING_CONSENT_ACCEPTED,
})
export const declineRecordingConsent = () => ({
  type: RECORDING_CONSENT_DENIED,
})

export const callStarted = () => (dispatch) => {
  dispatch({ type: CALL_STARTED })
  dispatch(startCallCounter())
}

export const callEnded = () => (dispatch) => {
  dispatch({ type: CALL_ENDED })
  stopCallCounter()
}

export const callFailed = () => (dispatch) => {
  dispatch({ type: CALL_FAILED })
  stopCallCounter()
}

export const resetCallFailed = () => ({
  type: RESET_CALL_FAILED,
})

export function updateTalkEmbeddableConfig(config) {
  return {
    type: TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
    payload: config,
  }
}

export function updateTalkAgentAvailability(availability) {
  return {
    type: TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
    payload: availability,
  }
}

export function updateTalkAverageWaitTime(averageWaitTime) {
  return {
    type: TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
    payload: averageWaitTime,
  }
}

export function talkDisconnect() {
  return {
    type: TALK_DISCONNECT_SOCKET_EVENT,
  }
}

export function updateTalkCallbackForm(formState) {
  return {
    type: UPDATE_CALLBACK_FORM,
    payload: formState,
  }
}

export function submitTalkCallbackForm(serviceUrl, nickname) {
  return (dispatch, getState) => {
    const formState = getFormState(getState())
    const additionalInfo = _.pickBy(
      {
        name: formState.name,
        description: formState.description,
      },
      _.identity
    )
    const subdomain = parseUrl(serviceUrl).hostname.split('.')[0]
    const params = {
      phoneNumber: formState.phone,
      additionalInfo,
      subdomain,
      keyword: nickname,
    }
    const callbacks = {
      done: () => {
        dispatch({ type: TALK_CALLBACK_SUCCESS, payload: formState })
        dispatch(updateTalkCallbackForm({}))
        dispatch(updateBackButtonVisibility(false))
      },
      fail: (err) => {
        const errorMessage = err.responseJSON
          ? err.responseJSON.error
          : JSON.parse(err.response.text).error
        const error = {
          message: errorMessage,
          status: err.status,
        }

        dispatch({
          type: TALK_CALLBACK_FAILURE,
          payload: error,
        })
      },
    }

    dispatch({
      type: TALK_CALLBACK_REQUEST,
      payload: formState,
    })

    http.callMeRequest(serviceUrl, {
      params,
      callbacks,
    })
  }
}

let requests = 0
const talkPollInterval = () => {
  if (requests < REQUESTS_BEFORE_BACKOFF) {
    requests += 1
    return BASE_TALK_POLL_INTERVAL
  }
  const delay = BASE_TALK_POLL_INTERVAL * Math.pow(2, requests - REQUESTS_BEFORE_BACKOFF)
  requests += 1
  return Math.min(delay, MAX_TALK_POLL_INTERVAL)
}

const pathsToSkip = {}
export function pollTalkStatus() {
  return async (dispatch, getState) => {
    const path = getDeferredTalkApiUrl(getState())
    while (getIsPollingTalk(getState())) {
      const skip = (document.hidden && requests > 1) || pathsToSkip[path]

      if (!skip) {
        http
          .get({ path }, { skipCache: true })
          .then((response) => {
            if (!getIsPollingTalk(getState())) {
              return
            }
            dispatch({
              type: RECEIVED_DEFERRED_TALK_STATUS,
              payload: response.body,
            })
          })
          .catch((err) => {
            errorTracker.warn(err, {
              rollbarFingerprint: 'Failed to connect to deferred talk endpoint',
              rollbarTitle: 'Failed to connect to deferred talk endpoint',
            })
            if (err.status == 404) {
              pathsToSkip[path] = true
            }
          })
      }
      await wait(talkPollInterval())
    }
  }
}

export function loadTalkVendors() {
  return (dispatch, getState) => {
    if (!getTalkEnabled(getState())) return

    const nickname = getTalkNickname(getState())

    const onSuccess = ({ default: io }) => {
      dispatch(handleTalkVendorLoaded({ io }))
      if (_.isEmpty(nickname)) return

      const socket = socketio.connect(io, getTalkServiceUrl(getState()), nickname)

      socketio.mapEventsToActions(socket, { dispatch })
    }
    const onFailure = (err) => {
      errorTracker.error(err)
    }

    return import(/* webpackChunkName: 'talk-sdk' */ 'socket.io-client')
      .then(onSuccess)
      .catch(onFailure)
  }
}

export function handleTalkVendorLoaded(vendor) {
  return {
    type: TALK_VENDOR_LOADED,
    payload: vendor,
  }
}

export const successDoneButtonClicked = () => (dispatch) => {
  dispatch(handleCloseButtonClicked())
  dispatch({
    type: TALK_SUCCESS_DONE_BUTTON_CLICKED,
  })
}
