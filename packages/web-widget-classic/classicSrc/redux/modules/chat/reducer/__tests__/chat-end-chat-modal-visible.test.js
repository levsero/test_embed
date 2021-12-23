import { UPDATE_END_CHAT_MODAL_VISIBILITY } from 'classicSrc/redux/modules/chat/chat-action-types'
import endChatModalVisible from 'classicSrc/redux/modules/chat/reducer/chat-end-chat-modal-visible'
import { testReducer } from 'classicSrc/util/testHelpers'

testReducer(endChatModalVisible, [
  {
    action: {
      type: UPDATE_END_CHAT_MODAL_VISIBILITY,
      payload: { isVisible: true },
    },
    initialState: false,
    expected: true,
  },
  {
    action: {
      type: UPDATE_END_CHAT_MODAL_VISIBILITY,
      payload: { isVisible: false },
    },
    initialState: true,
    expected: false,
  },
])
