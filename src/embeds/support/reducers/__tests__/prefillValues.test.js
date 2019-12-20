import { testReducer } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import prefillValues from '../prefillValues'

const initialState = {}

testReducer(prefillValues, [
  {
    action: { type: undefined },
    expected: initialState,
    initialState: undefined
  },
  {
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
      email: 'email@example.com',
      name: 'Some name'
    },
    initialState
  }
])
