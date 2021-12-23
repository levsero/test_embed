import { ADD_RESTRICTED_IMAGE } from 'classicSrc/embeds/helpCenter/actions/action-types'
import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import _ from 'lodash'

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
