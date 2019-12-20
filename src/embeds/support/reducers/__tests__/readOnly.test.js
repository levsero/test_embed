import { testReducer } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import readOnly from '../readOnly'

const initialState = {}

testReducer(readOnly, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: {
      name: false,
      email: false
    }
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
      name: true
    }
  },
  {
    initialState: {
      name: true
    },
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com',
        readOnly: true
      },
      name: {
        value: 'Some name',
        readOnly: false
      }
    }),
    expected: {
      email: true,
      name: false
    }
  }
])
