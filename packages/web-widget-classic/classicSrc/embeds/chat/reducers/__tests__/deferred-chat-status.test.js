import { DEFER_CHAT_SETUP } from 'classicSrc/embeds/chat/actions/action-types'
import { beginChatSetup } from 'classicSrc/embeds/chat/actions/setup-chat'
import { testReducer } from 'classicSrc/util/testHelpers'
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
