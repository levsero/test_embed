import formStates from '../formStates'
import { CLEARED_FORM_STATES, SET_FORM_STATE } from 'src/embeds/support/actions/action-types'
import { testReducer } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'

const initialState = { bob: { fieldOne: 'saget' } }
const formStatePayload = {
  name: 'Boop',
  newFormState: { fieldA: 'a' }
}

testReducer(formStates, [
  {
    action: { type: undefined },
    expected: initialState,
    initialState
  },
  {
    action: { type: SET_FORM_STATE, payload: formStatePayload },
    expected: {
      ...initialState,
      Boop: { fieldA: 'a' }
    },
    initialState
  },
  {
    action: { type: CLEARED_FORM_STATES },
    expected: {},
    initialState
  },
  {
    action: handlePrefillReceived({
      name: {
        value: 'new a'
      }
    }),
    expected: {
      Boop: {
        name: 'new a',
        fieldB: 'b'
      }
    },
    initialState: {
      Boop: {
        name: 'a',
        fieldB: 'b'
      }
    }
  }
])
