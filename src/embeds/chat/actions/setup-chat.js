import {
  DEFER_CHAT_SETUP,
  BEGIN_CHAT_SETUP,
  RECEIVE_DEFERRED_CHAT_STATUS
} from 'embeds/chat/actions/action-types'
import { getDeferredChatApi } from 'src/redux/modules/chat/chat-selectors'
import {
  BASE_CHAT_POLL_INTERVAL,
  MAX_CHAT_POLL_INTERVAL,
  REQUESTS_BEFORE_BACKOFF
} from 'constants/chat'
import wait from 'utility/wait'
import { getIsPollingChat } from 'embeds/chat/selectors'
import { fetchDeferredChatStatus } from 'embeds/chat/apis/deferred-chat-api'
import errorTracker from 'service/errorTracker/errorTracker'
import { document } from 'utility/globals'
export const beginChatSetup = () => ({
  type: BEGIN_CHAT_SETUP
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
    type: DEFER_CHAT_SETUP
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
            departments
          }
        })
      } catch (err) {
        errorTracker.error(new Error('Failed getting deferred chat data'), {
          apiError: err
        })
      }
    }
    await wait(chatPollInterval())
  }
}
