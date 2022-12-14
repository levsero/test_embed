import _ from 'lodash'
import {
  GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
  UPDATE_PREVIEWER_SETTINGS,
} from '../../chat-action-types'

const initialState = {
  form: {
    name: { name: 'name', required: false },
    email: { name: 'email', required: false },
    phone: { name: 'phone', required: false },
    department: { name: 'department', required: false },
    message: { name: 'message', required: false },
  },
  message: '',
  profile_required: false,
  required: false,
}

const prechatForm = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
    case UPDATE_PREVIEWER_SETTINGS:
      return _.get(action.payload, 'forms.pre_chat_form', state)
    default:
      return state
  }
}

export default prechatForm
