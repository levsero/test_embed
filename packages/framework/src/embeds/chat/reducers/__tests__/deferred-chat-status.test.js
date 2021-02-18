import { testReducer } from 'utility/testHelpers'
import { beginChatSetup } from 'embeds/chat/actions/setup-chat'
import { DEFER_CHAT_SETUP } from 'embeds/chat/actions/action-types'
import reducer from '../deferred-chat-is-polling'

describe('deferredChatIsPolling reducer', () => {
  testReducer(reducer, [
    {
      extraDesc: 'initial state',
      initialState: undefined,
      action: { type: 'some action' },
      expected: false,
    },
    {
      extraDesc: 'begin polling',
      initialState: false,
      action: { type: DEFER_CHAT_SETUP },
      expected: true,
    },
    {
      extraDesc: 'stop polling',
      initialState: true,
      action: beginChatSetup(),
      expected: false,
    },
  ])
})
