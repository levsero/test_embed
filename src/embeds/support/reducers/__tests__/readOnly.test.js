import { testReducer } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import readOnly from '../readOnly'
import createKeyID from 'embeds/support/utils/createKeyID'

const initialState = {}

testReducer(readOnly, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: {}
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
      [createKeyID('name')]: true
    }
  },
  {
    initialState: {
      [createKeyID('name')]: true
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
      [createKeyID('email')]: true,
      [createKeyID('name')]: false
    }
  }
])
