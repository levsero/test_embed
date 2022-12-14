import {
  EDIT_CONTACT_DETAILS_SCREEN,
  EDIT_CONTACT_DETAILS_LOADING_SCREEN,
  EDIT_CONTACT_DETAILS_ERROR_SCREEN,
} from 'classicSrc/constants/chat'
import { getDisplayName } from 'classicSrc/util/chat'
import _ from 'lodash'
import { PREFILL_RECEIVED, API_CLEAR_FORM } from '../../base/base-action-types'
import {
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  SET_VISITOR_INFO_REQUEST_PENDING,
  SDK_ERROR,
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
  UPDATE_CHAT_CONTACT_DETAILS_INFO,
  SDK_VISITOR_UPDATE,
} from '../chat-action-types'

const initialState = {
  status: EDIT_CONTACT_DETAILS_SCREEN,
  show: false,
  display_name: null,
  email: null,
  error: false,
}

const editContactDetails = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_SCREEN,
        display_name: payload.display_name,
        email: payload.email,
        error: false,
      }
    case SET_VISITOR_INFO_REQUEST_PENDING:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_LOADING_SCREEN,
        display_name: payload.display_name,
        email: payload.email,
      }
    case SDK_ERROR:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_ERROR_SCREEN,
        error: true,
      }
    case SDK_VISITOR_UPDATE:
      const payloadEmail = _.get(payload, 'detail.email', '')

      return {
        ...state,
        ...payload.detail,
        email: _.isEmpty(payloadEmail) ? state.email : payloadEmail,
        display_name: getDisplayName(_.get(payload, 'detail.display_name', ''), state.display_name),
      }
    case UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_SCREEN,
        show: payload,
      }
    case UPDATE_CHAT_CONTACT_DETAILS_INFO:
      return {
        ...state,
        display_name: payload.display_name,
        email: payload.email,
      }
    case PREFILL_RECEIVED:
      return {
        ...state,
        display_name: _.get(payload, 'prefillValues.name', state.display_name),
        email: _.get(payload, 'prefillValues.email', state.email),
      }
    case API_CLEAR_FORM:
      return initialState
    default:
      return state
  }
}

export default editContactDetails
