import { SET_VISITOR_INFO_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import { testReducer } from 'src/util/testHelpers'
import identify from '../identify'

const initialState = {
  values: {},
  timestamp: 0,
}

testReducer(identify, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState,
    action: {
      type: SET_VISITOR_INFO_REQUEST_SUCCESS,
      payload: { name: 'someone', email: 'someone@example.com', timestamp: 123 },
    },
    expected: {
      timestamp: 123,
      values: {
        name: 'someone',
        email: 'someone@example.com',
        timestamp: 123,
      },
    },
  },
  {
    initialState: { timestamp: 100, values: { name: 'someone' } },
    action: {
      type: SET_VISITOR_INFO_REQUEST_SUCCESS,
      payload: { email: 'someone@example.com', timestamp: 123 },
    },
    expected: {
      timestamp: 123,
      values: {
        name: 'someone',
        email: 'someone@example.com',
        timestamp: 123,
      },
    },
  },
])
