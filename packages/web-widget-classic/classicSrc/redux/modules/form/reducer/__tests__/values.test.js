import { API_CLEAR_FORM, API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import { clearFormState, clearAllForms, setFormState } from 'classicSrc/redux/modules/form/actions'
import { testReducer } from 'classicSrc/util/testHelpers'
import formValues from '../formValues'

const initialState = { bob: { fieldOne: 'saget' } }

testReducer(formValues, [
  {
    initialState,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState,
    action: setFormState('Boop', { fieldA: 'a' }),
    expected: {
      ...initialState,
      Boop: { fieldA: 'a' },
    },
  },
  {
    initialState: {
      ...initialState,
      Beep: { fieldB: 'b' },
      Boop: { fieldA: 'a' },
    },
    action: clearFormState('Boop'),
    expected: { ...initialState, Beep: { fieldB: 'b' } },
  },
  {
    initialState,
    action: clearAllForms(),
    expected: {},
  },
  {
    initialState,
    action: { type: API_CLEAR_FORM },
    expected: {},
  },
  {
    initialState,
    action: { type: API_RESET_WIDGET },
    expected: {},
  },
])
