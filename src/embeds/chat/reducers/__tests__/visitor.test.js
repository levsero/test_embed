import { testReducer } from 'utility/testHelpers'
import reducer from '../visitor'
import {
  SDK_CHAT_MEMBER_JOIN,
  SDK_VISITOR_UPDATE,
  SET_VISITOR_INFO_REQUEST_SUCCESS
} from 'src/redux/modules/chat/chat-action-types'

describe('deferredChatIsPolling reducer', () => {
  testReducer(reducer, [
    {
      extraDesc: 'initial state',
      initialState: undefined,
      action: { type: 'some action' },
      expected: {}
    },
    {
      initialState: undefined,
      action: { type: SDK_CHAT_MEMBER_JOIN, payload: { detail: { nick: 'Some user' } } },
      expected: {
        nick: 'Some user'
      }
    },
    {
      initialState: undefined,
      action: { type: SDK_CHAT_MEMBER_JOIN, payload: { detail: { nick: 'agent:Some user' } } },
      expected: {}
    },
    {
      extraDesc: 'When SDK_VISITOR_UPDATE includes the nick name',
      initialState: { email: 'example@example.com' },
      action: { type: SDK_VISITOR_UPDATE, payload: { detail: { nick: 'Some user' } } },
      expected: {
        email: 'example@example.com',
        nick: 'Some user'
      }
    },
    {
      extraDesc: 'When SDK_VISITOR_UPDATE does not include the nick name',
      initialState: { nick: 'Some user' },
      action: {
        type: SDK_VISITOR_UPDATE,
        payload: { detail: { email: 'example@example.com' } }
      },
      expected: {
        email: 'example@example.com',
        nick: 'visitor'
      }
    },
    {
      extraDesc: 'When SDK_VISITOR_UPDATE does not include the nick name',
      initialState: { nick: 'Some user' },
      action: {
        type: SET_VISITOR_INFO_REQUEST_SUCCESS,
        payload: { whateverInfo: 'It takes anything' }
      },
      expected: {
        nick: 'Some user',
        whateverInfo: 'It takes anything'
      }
    }
  ])
})
