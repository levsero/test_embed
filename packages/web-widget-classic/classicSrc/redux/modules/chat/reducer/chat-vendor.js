import { nullZChat } from 'classicSrc/util/nullZChat'
import { CHAT_VENDOR_LOADED, PREVIEWER_LOADED } from '../chat-action-types'

const initialState = {
  zChat: nullZChat,
  slider: null,
}

const vendor = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case CHAT_VENDOR_LOADED:
      return { ...state, ...payload }
    case PREVIEWER_LOADED:
      return {
        ...state,
        zChat: {
          getAuthLoginUrl: () => '',
          getMachineId: () => '',
          markAsRead: () => {},
        },
      }
    default:
      return state
  }
}

export default vendor
