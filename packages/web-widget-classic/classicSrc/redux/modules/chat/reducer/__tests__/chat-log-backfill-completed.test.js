import { CHAT_CONNECTED } from 'classicSrc/redux/modules/chat/chat-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import chatLogBackfillCompleted from '../chat-log-backfill-completed'

testReducer(chatLogBackfillCompleted, [
  {
    action: {
      type: 'initial state',
    },
    expected: false,
  },
  {
    action: {
      type: CHAT_CONNECTED,
    },
    expected: true,
  },
  {
    initialState: true,
    action: {
      type: CHAT_CONNECTED,
    },
    expected: true,
  },
  {
    initialState: true,
    action: {
      type: 'SOME_OTHER_ACTION',
    },
    expected: true,
  },
])
