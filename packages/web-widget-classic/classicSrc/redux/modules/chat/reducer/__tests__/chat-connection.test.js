import * as actions from 'classicSrc/redux/modules/chat/chat-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'

let chatConnection = require('../chat-connection').default

testReducer(chatConnection, [
  {
    action: {
      type: actions.SDK_CONNECTION_UPDATE,
      payload: { detail: 'connected' },
    },
    expected: 'connected',
  },
  {
    action: {
      type: actions.CHAT_CONNECTION_ERROR,
    },
    expected: 'closed',
  },
  {
    action: {
      type: actions.CHAT_BANNED,
    },
    expected: 'closed',
  },
])
