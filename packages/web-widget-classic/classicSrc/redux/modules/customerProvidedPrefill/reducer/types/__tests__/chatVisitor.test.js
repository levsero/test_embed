import { SDK_VISITOR_UPDATE } from 'classicSrc/redux/modules/chat/chat-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import chatVisitor from '../chatVisitor'

const initialState = {
  values: {},
  timestamp: 0,
}

testReducer(chatVisitor, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState: undefined,
    action: {
      type: SDK_VISITOR_UPDATE,
      payload: {
        type: 'vistor_update',
        detail: { display_name: 'someone', email: 'someone@example.com', phone: '123456' },
        timestamp: 123,
      },
    },
    expected: {
      timestamp: 123,
      values: {
        name: 'someone',
        email: 'someone@example.com',
        phone: '123456',
      },
    },
  },
  {
    initialState: { timestamp: 100, values: { name: 'someone' } },
    action: {
      type: SDK_VISITOR_UPDATE,
      payload: {
        type: 'vistor_update',
        detail: { display_name: '', email: 'someone@example.com', phone: '123456' },
        timestamp: 123,
      },
    },
    expected: {
      timestamp: 123,
      values: {
        name: '',
        email: 'someone@example.com',
        phone: '123456',
      },
    },
  },
  {
    initialState: { timestamp: 100, values: { name: 'someone' } },
    action: {
      type: SDK_VISITOR_UPDATE,
      payload: {
        type: 'vistor_update',
        detail: { display_name: 'someone else', email: 'someone@example.com' },
        timestamp: 123,
      },
    },
    expected: {
      timestamp: 123,
      values: {
        name: 'someone else',
        email: 'someone@example.com',
      },
    },
  },
])
