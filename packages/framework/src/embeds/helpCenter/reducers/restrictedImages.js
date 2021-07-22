import _ from 'lodash'
import { ADD_RESTRICTED_IMAGE } from 'embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = {}

const restrictedImages = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case ADD_RESTRICTED_IMAGE:
      return _.extend({}, state, payload)
    case API_RESET_WIDGET:
      return initialState
    default:
      return state
  }
}

export default restrictedImages
