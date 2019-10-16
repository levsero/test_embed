import { SEARCH_REQUEST_SENT } from 'embeds/helpCenter/actions/action-types'
import { API_CLEAR_HC_SEARCHES } from 'src/redux/modules/base/base-action-types'

const initialState = false

const searchAttempted = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case SEARCH_REQUEST_SENT:
      return true
    case API_CLEAR_HC_SEARCHES:
      return initialState
    default:
      return state
  }
}

export default searchAttempted
