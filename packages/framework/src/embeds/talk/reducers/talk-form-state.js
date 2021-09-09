import { UPDATE_CALLBACK_FORM } from 'src/embeds/talk/action-types'
import { API_CLEAR_FORM } from 'src/redux/modules/base/base-action-types'

const initialState = {
  name: '',
  phone: '',
}

const formState = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CALLBACK_FORM:
      return {
        ...initialState,
        ...action.payload,
      }
    case API_CLEAR_FORM:
      return initialState
    default:
      return state
  }
}

export default formState
