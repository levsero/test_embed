import { UPDATE_DEFERRED_CHAT_ONLINE_STATUS } from 'embeds/chat/actions/action-types'

export const updateDeferredChatData = (status = '', departments = {}) => ({
  type: UPDATE_DEFERRED_CHAT_ONLINE_STATUS,
  payload: {
    status,
    departments
  }
})
