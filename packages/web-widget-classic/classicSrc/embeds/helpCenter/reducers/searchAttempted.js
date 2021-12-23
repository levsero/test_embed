import { SEARCH_REQUEST_SENT } from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'

const initialState = false

const searchAttempted = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case SEARCH_REQUEST_SENT:
      return true
    case API_RESET_WIDGET:
      return initialState
    default:
      return state
  }
}

export default searchAttempted
