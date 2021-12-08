import {
  BASE_CHAT_POLL_INTERVAL,
  MAX_CHAT_POLL_INTERVAL,
  REQUESTS_BEFORE_BACKOFF,
} from 'classicSrc/constants/chat'
import {
  DEFER_CHAT_SETUP,
  BEGIN_CHAT_SETUP,
  RECEIVE_DEFERRED_CHAT_STATUS,
} from 'classicSrc/embeds/chat/actions/action-types'
import { fetchDeferredChatStatus } from 'classicSrc/embeds/chat/apis/deferred-chat-api'
import { getIsPollingChat, getDeferredChatApi } from 'classicSrc/embeds/chat/selectors'
import wait from 'classicSrc/util/wait'
import { errorTracker, document } from '@zendesk/widget-shared-services'

export const beginChatSetup = () => ({
  type: BEGIN_CHAT_SETUP,
})

let requests = 0
const chatPollInterval = () => {
  if (requests < REQUESTS_BEFORE_BACKOFF) {
    requests += 1
    return BASE_CHAT_POLL_INTERVAL
  }
  const delay = BASE_CHAT_POLL_INTERVAL * Math.pow(2, requests - REQUESTS_BEFORE_BACKOFF)
  requests += 1
  return Math.min(delay, MAX_CHAT_POLL_INTERVAL)
}

export const deferChatSetup = () => async (dispatch, getState) => {
  if (getIsPollingChat(getState())) {
    return
  }

  dispatch({
    type: DEFER_CHAT_SETUP,
  })
  while (getIsPollingChat(getState())) {
    const skip = document.hidden && requests > 1
    if (!skip) {
      try {
        const { status, departments } = await fetchDeferredChatStatus(
          getDeferredChatApi(getState())
        )
        if (!getIsPollingChat(getState())) {
          return
        }
        dispatch({
          type: RECEIVE_DEFERRED_CHAT_STATUS,
          payload: {
            status,
            departments,
          },
        })
      } catch (err) {
        errorTracker.warn(err, {
          rollbarFingerprint: 'Failed to connect to chat ODVR endpoint',
          rollbarTitle: 'Failed to connect to chat ODVR endpoint',
        })
      }
    }
    await wait(chatPollInterval())
  }
}
