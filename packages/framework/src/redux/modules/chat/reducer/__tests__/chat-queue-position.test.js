import { CONNECTION_STATUSES } from 'constants/chat'
import { SDK_CHAT_QUEUE_POSITION } from 'src/redux/modules/chat/chat-action-types'
import { SDK_CONNECTION_UPDATE } from 'src/redux/modules/chat/chat-action-types'
import { testReducer } from 'src/util/testHelpers'
import chatQueuePosition from '../chat-queue-position'

testReducer(chatQueuePosition, [
  {
    action: {
      type: '__INIT',
      payload: true,
    },
    initialState: undefined,
    expected: 0,
  },
  {
    action: {
      type: SDK_CHAT_QUEUE_POSITION,
      payload: {
        detail: {
          queue_position: 5,
        },
      },
    },
    initialState: 1,
    expected: 5,
  },
  {
    action: {
      type: SDK_CONNECTION_UPDATE,
      payload: { type: 'connection_update', detail: CONNECTION_STATUSES.CLOSED },
    },
    initialState: 5,
    expected: 0,
    extraDesc: 'resets to the initial state when the connection is closed',
  },
])
