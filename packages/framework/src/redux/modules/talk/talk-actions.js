import _ from 'lodash'
import { TALK_SUCCESS_DONE_BUTTON_CLICKED } from 'src/embeds/talk/action-types'
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
} from 'src/embeds/talk/action-types'
import { getFormState, getIsPollingTalk } from 'src/embeds/talk/selectors'
import errorTracker from 'src/framework/services/errorTracker'
import { handleCloseButtonClicked, updateBackButtonVisibility } from 'src/redux/modules/base'
import {
  getTalkEnabled,
  getTalkNickname,
  getTalkServiceUrl,
  getDeferredTalkApiUrl,
} from 'src/redux/modules/selectors'
import {
  BASE_TALK_POLL_INTERVAL,
  MAX_TALK_POLL_INTERVAL,
  REQUESTS_BEFORE_BACKOFF,
} from 'src/redux/modules/talk/constants'
import { http, socketio } from 'src/service/transport'
import { parseUrl } from 'src/util/utils'
import wait from 'src/util/wait'

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
