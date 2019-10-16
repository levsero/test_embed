import { SEARCH_REQUEST_SENT } from 'embeds/helpCenter/actions/action-types'

const initialState = false

const searchAttempted = (state = initialState, action) => {
  const { type } = action

  switch (type) {
    case SEARCH_REQUEST_SENT:
      return true
    default:
      return state
  }
}

export default searchAttempted
