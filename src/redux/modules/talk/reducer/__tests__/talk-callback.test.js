import callback from '../talk-callback'
import * as actionTypes from 'src/redux/modules/talk/talk-action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = {
  isSending: false,
  success: false,
  error: {},
  phoneNumber: ''
}

testReducer(callback, [
  {
    action: { type: undefined },
    expected: initialState
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { isSending: true, phoneNumber: '123' },
    expected: { isSending: true, phoneNumber: '123' }
  },
  {
    action: {
      type: actionTypes.TALK_CALLBACK_REQUEST,
      payload: { phone: '+1234' }
    },
    expected: {
      isSending: true,
      phoneNumber: '+1234',
      error: {},
      success: false
    }
  },
  {
    action: {
      type: actionTypes.TALK_CALLBACK_SUCCESS,
      payload: { phone: '+1234' }
    },
    initialState: { isSending: true },
    expected: {
      isSending: false,
      phoneNumber: '+1234',
      error: {},
      success: true
    }
  },
  {
    action: {
      type: actionTypes.TALK_CALLBACK_FAILURE,
      payload: { e: 'this is the error' }
    },
    initialState: { phoneNumber: '+1234', isSending: true },
    expected: {
      isSending: false,
      phoneNumber: '+1234',
      error: { e: 'this is the error' },
      success: false
    }
  },
  {
    action: {
      type: actionTypes.TALK_SUCCESS_DONE_BUTTON_CLICKED
    },
    initialState: { phoneNumber: '+1234', success: true },
    expected: { phoneNumber: '+1234', success: false }
  }
])
