import { updateAcknowledged } from 'classicSrc/redux/modules/customerProvidedPrefill/actions'
import { testReducer } from 'classicSrc/util/testHelpers'
import acknowledged from '../acknowledged'

const initialState = {}

testReducer(acknowledged, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState: {
      identify: {
        prechatForm: 123,
      },
    },
    action: updateAcknowledged('identify', 'prechatForm', 123),
    expected: {
      identify: {
        prechatForm: 123,
      },
    },
  },
  {
    initialState: {
      identify: {
        prechatForm: 123,
      },
    },
    action: updateAcknowledged('identify', 'anotherForm', 456),
    expected: {
      identify: {
        prechatForm: 123,
        anotherForm: 456,
      },
    },
  },
])
