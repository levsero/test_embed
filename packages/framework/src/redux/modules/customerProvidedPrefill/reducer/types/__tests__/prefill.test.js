import { handlePrefillReceived } from 'src/redux/modules/base'
import { testReducer } from 'utility/testHelpers'
import prefill from '../prefill'

Date.now = jest.fn(() => 1559097574000)

const initialState = {
  values: {},
  timestamp: 0,
}

testReducer(prefill, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState,
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com',
      },
      name: {
        value: 'Some name',
        readOnly: true,
      },
    }),
    expected: {
      timestamp: Date.now(),
      values: {
        email: 'email@example.com',
        name: 'Some name',
      },
    },
  },
])
