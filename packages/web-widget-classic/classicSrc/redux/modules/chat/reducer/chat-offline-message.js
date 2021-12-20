import { OFFLINE_FORM_SCREENS } from 'classicSrc/constants/chat'
import {
  OFFLINE_FORM_REQUEST_SENT,
  OFFLINE_FORM_REQUEST_FAILURE,
  OFFLINE_FORM_REQUEST_SUCCESS,
  OFFLINE_FORM_BACK_BUTTON_CLICKED,
  OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED,
} from '../chat-action-types'

const initialState = {
  screen: OFFLINE_FORM_SCREENS.MAIN,
  details: {
    name: '',
    email: '',
    message: '',
  },
  error: false,
}

const offlineMessage = (state = initialState, action) => {
  switch (action.type) {
    case OFFLINE_FORM_REQUEST_SENT:
      return {
        details: {},
        error: false,
        screen: OFFLINE_FORM_SCREENS.LOADING,
      }
    case OFFLINE_FORM_REQUEST_SUCCESS:
      return {
        ...state,
        details: action.payload,
        screen: OFFLINE_FORM_SCREENS.SUCCESS,
      }
    case OFFLINE_FORM_REQUEST_FAILURE:
      return {
        ...state,
        error: true,
        screen: OFFLINE_FORM_SCREENS.MAIN,
      }
    case OFFLINE_FORM_BACK_BUTTON_CLICKED:
      return {
        ...state,
        screen: OFFLINE_FORM_SCREENS.MAIN,
      }
    case OFFLINE_FORM_OPERATING_HOURS_LINK_CLICKED:
      return {
        ...state,
        screen: OFFLINE_FORM_SCREENS.OPERATING_HOURS,
      }
    default:
      return state
  }
}

export default offlineMessage
