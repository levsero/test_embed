import * as actions from 'classicSrc/redux/modules/chat/chat-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'

let hasSdkConnected = require('../chat-sdk-connected').default

testReducer(hasSdkConnected, [
  {
    expected: false,
  },
  {
    action: {
      type: actions.CHAT_CONNECTED,
    },
    expected: true,
  },
  {
    action: {
      type: 'random_event',
    },
    expected: false,
  },
])
