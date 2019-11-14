import activeFormName from '../activeFormName'
import {
  SET_ACTIVE_FORM_NAME,
  CLEARED_ACTIVE_FORM_NAME
} from 'src/embeds/support/actions/action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = ''

testReducer(activeFormName, [
  {
    action: { type: undefined },
    expected: initialState,
    initialState
  },
  {
    action: { type: SET_ACTIVE_FORM_NAME, payload: { name: 'contactForm' } },
    expected: 'contactForm',
    initialState
  },
  {
    action: { type: CLEARED_ACTIVE_FORM_NAME },
    expected: '',
    initialState
  }
])
