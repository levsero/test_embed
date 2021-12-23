import { RECEIVE_DEFERRED_CHAT_STATUS } from 'classicSrc/embeds/chat/actions/action-types'
import { SDK_ACCOUNT_STATUS, UPDATE_PREVIEWER_SCREEN } from '../chat-action-types'

const initialState = ''

const accountStatus = (state = initialState, action) => {
  switch (action.type) {
    case SDK_ACCOUNT_STATUS:
      return action.payload.detail
    case UPDATE_PREVIEWER_SCREEN:
    case RECEIVE_DEFERRED_CHAT_STATUS:
      return action.payload.status
    default:
      return state
  }
}

export default accountStatus
