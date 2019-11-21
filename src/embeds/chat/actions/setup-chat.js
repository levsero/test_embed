import {
  DEFER_CHAT_SETUP,
  BEGIN_CHAT_SETUP,
  RECEIVE_DEFERRED_CHAT_STATUS
} from 'embeds/chat/actions/action-types'
import { getDeferredChatApi } from 'src/redux/modules/chat/chat-selectors'
import { CHAT_POLL_INTERVAL } from 'constants/chat'
import wait from 'utility/wait'
import { getIsPollingChat } from 'embeds/chat/selectors'
import { fetchDeferredChatStatus } from 'embeds/chat/api/deferred-chat-api'
import errorTracker from 'service/errorTracker/errorTracker'

export const beginChatSetup = () => ({
  type: BEGIN_CHAT_SETUP
})

export const deferChatSetup = () => async (dispatch, getState) => {
  if (getIsPollingChat(getState())) {
    return
  }

  dispatch({
    type: DEFER_CHAT_SETUP
  })
  while (getIsPollingChat(getState())) {
    try {
      const { status, departments } = await fetchDeferredChatStatus(getDeferredChatApi(getState()))
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
    await wait(CHAT_POLL_INTERVAL)
  }
}
