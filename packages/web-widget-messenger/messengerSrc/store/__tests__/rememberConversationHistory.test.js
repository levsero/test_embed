import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { testReducer } from 'messengerSrc/utils/testHelpers'
import reducer from '../rememberConversationHistory'

testReducer(reducer, [
  {
    extraDesc: 'initial state',
    action: { type: undefined },
    expected: false,
  },
  {
    extraDesc: 'config received with Remember history',
    action: { type: messengerConfigReceived.type, payload: { conversationHistory: 'remember' } },
    expected: true,
  },
  {
    extraDesc: 'config received with Remember history',
    action: { type: messengerConfigReceived.type, payload: { conversationHistory: 'forget' } },
    expected: false,
  },
  {
    extraDesc: 'Any other action while false',
    action: { type: 'any other action' },
    expected: false,
  },
  {
    extraDesc: 'Any other action while true',
    initialState: true,
    action: { type: 'any other action' },
    expected: true,
  },
])
