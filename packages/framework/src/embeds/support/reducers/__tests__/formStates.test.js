import {
  CLEARED_FORM_STATES,
  SET_FORM_STATE,
  CLEARED_FORM_STATE,
  TICKET_SUBMISSION_REQUEST_SUCCESS,
} from 'src/embeds/support/actions/action-types'
import { API_CLEAR_FORM, API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { testReducer } from 'src/util/testHelpers'
import formStates from '../formStates'

const initialState = { bob: { fieldOne: 'saget' } }
const formStatePayload = {
  name: 'Boop',
  newFormState: { fieldA: 'a' },
}

testReducer(formStates, [
  {
    action: { type: undefined },
    expected: initialState,
    initialState,
  },
  {
    action: { type: SET_FORM_STATE, payload: formStatePayload },
    expected: {
      ...initialState,
      Boop: { fieldA: 'a' },
    },
    initialState,
  },
  {
    action: { type: CLEARED_FORM_STATE, payload: { name: 'Boop' } },
    expected: { ...initialState, Beep: { fieldB: 'b' } },
    initialState: {
      ...initialState,
      Beep: { fieldB: 'b' },
      Boop: { fieldA: 'a' },
    },
  },
  {
    action: { type: TICKET_SUBMISSION_REQUEST_SUCCESS, payload: { name: 'Beep' } },
    expected: { ...initialState, Boop: { fieldA: 'a' } },
    initialState: {
      ...initialState,
      Beep: { fieldB: 'b' },
      Boop: { fieldA: 'a' },
    },
  },
  {
    action: { type: CLEARED_FORM_STATES },
    expected: {},
    initialState,
  },
  {
    action: { type: API_CLEAR_FORM },
    expected: {},
    initialState,
  },
  {
    action: { type: API_RESET_WIDGET },
    expected: {},
    initialState,
  },
])
