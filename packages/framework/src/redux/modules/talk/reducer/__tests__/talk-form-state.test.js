import formState from '../talk-form-state'
import * as actionTypes from 'src/redux/modules/talk/talk-action-types'
import { API_CLEAR_FORM } from '../../../base/base-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = {
  name: '',
  phone: '',
}

testReducer(formState, [
  {
    action: { type: undefined },
    expected: initialState,
  },
  {
    action: { type: 'something' },
    initialState: { name: 'vafasdf' },
    expected: { name: 'vafasdf' },
  },
  {
    action: {
      type: actionTypes.UPDATE_CALLBACK_FORM,
      payload: { phone: '+61412345678' },
    },
    expected: {
      name: '',
      phone: '+61412345678',
    },
  },
  {
    action: {
      type: API_CLEAR_FORM,
    },
    initialState: { name: 'fasdfas', phone: '+412341234' },
    expected: initialState,
  },
])
