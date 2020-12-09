import { SEARCH_FIELD_CHANGED } from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET, API_CLEAR_FORM } from 'src/redux/modules/base/base-action-types'

const initialState = ''

const searchFieldValue = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SEARCH_FIELD_CHANGED:
      return payload
    case API_CLEAR_FORM:
    case API_RESET_WIDGET:
      return initialState
    default:
      return state
  }
}

export default searchFieldValue
