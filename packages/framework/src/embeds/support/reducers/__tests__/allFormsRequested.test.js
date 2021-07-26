import { ALL_FORMS_REQUESTED } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'src/util/testHelpers'
import allFormsRequested from '../allFormsRequested'

const initialState = false

testReducer(allFormsRequested, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: ALL_FORMS_REQUESTED, payload: true },
    expected: true,
  },
  {
    action: { type: ALL_FORMS_REQUESTED, payload: false },
    expected: false,
  },
])
