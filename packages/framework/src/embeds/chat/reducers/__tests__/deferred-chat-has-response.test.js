import { testReducer } from 'utility/testHelpers'
import { RECEIVE_DEFERRED_CHAT_STATUS } from 'embeds/chat/actions/action-types'

import reducer from '../deferred-chat-has-response'

describe('deferredChatHasResponse reducer', () => {
  testReducer(reducer, [
    {
      extraDesc: 'initialState',
      initialState: undefined,
      action: { type: 'some action' },
      expected: false,
    },
    {
      extraDesc: 'recieve response from SDK',
      initialState: false,
      action: { type: RECEIVE_DEFERRED_CHAT_STATUS },
      expected: true,
    },
  ])
})
