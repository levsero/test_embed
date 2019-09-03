import { ADD_RESTRICTED_IMAGE } from 'embeds/helpCenter/actions/action-types'
import _ from 'lodash'
import { API_CLEAR_HC_SEARCHES } from 'src/redux/modules/base/base-action-types'

const initialState = {}

const restrictedImages = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case ADD_RESTRICTED_IMAGE:
      return _.extend({}, state, payload)
    case API_CLEAR_HC_SEARCHES:
      return initialState
    default:
      return state
  }
}

export default restrictedImages
