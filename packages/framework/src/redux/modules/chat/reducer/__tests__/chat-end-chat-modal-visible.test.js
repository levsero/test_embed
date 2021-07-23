import { UPDATE_END_CHAT_MODAL_VISIBILITY } from 'src/redux/modules/chat/chat-action-types'
import endChatModalVisible from 'src/redux/modules/chat/reducer/chat-end-chat-modal-visible'
import { testReducer } from 'src/util/testHelpers'

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
