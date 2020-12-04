import { testReducer } from 'utility/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
Date.now = jest.fn(() => 1559097574000)
import prefill from '../prefill'

const initialState = {
  values: {},
  timestamp: 0
}

testReducer(prefill, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState
  },
  {
    initialState,
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com'
      },
      name: {
        value: 'Some name',
        readOnly: true
      }
    }),
    expected: {
      timestamp: Date.now(),
      values: {
        email: 'email@example.com',
        name: 'Some name'
      }
    }
  }
])
