import { testReducer } from 'src/util/testHelpers'
import { CHAT_CONNECTED } from 'src/redux/modules/chat/chat-action-types'
import chatLogBackfillCompleted from '../chat-log-backfill-completed'

testReducer(chatLogBackfillCompleted, [
  {
    action: {
      type: 'initial state'
    },
    expected: false
  },
  {
    action: {
      type: CHAT_CONNECTED
    },
    expected: true
  },
  {
    initialState: true,
    action: {
      type: CHAT_CONNECTED
    },
    expected: true
  },
  {
    initialState: true,
    action: {
      type: 'SOME_OTHER_ACTION'
    },
    expected: true
  }
])
