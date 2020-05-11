import { testReducer } from 'utility/testHelpers'
import acknowledged from '../acknowledged'
import { updateAcknowledged } from 'src/redux/modules/customerProvidedPrefill/actions'

const initialState = {}

testReducer(acknowledged, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState
  },
  {
    initialState: {
      identify: {
        prechatForm: 123
      }
    },
    action: updateAcknowledged('identify', 'prechatForm', 123),
    expected: {
      identify: {
        prechatForm: 123
      }
    }
  },
  {
    initialState: {
      identify: {
        prechatForm: 123
      }
    },
    action: updateAcknowledged('identify', 'anotherForm', 456),
    expected: {
      identify: {
        prechatForm: 123,
        anotherForm: 456
      }
    }
  }
])
