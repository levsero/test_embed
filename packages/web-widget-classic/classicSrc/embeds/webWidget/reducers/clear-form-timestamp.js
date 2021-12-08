import { API_CLEAR_FORM } from 'classicSrc/redux/modules/base/base-action-types'

const clearFormTimestamp = (state = 0, action) => {
  switch (action.type) {
    case API_CLEAR_FORM:
      return action.payload.timestamp
    default:
      return state
  }
}

export default clearFormTimestamp
