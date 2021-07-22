import { combineReducers } from 'redux'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import acknowledged from './acknowledged'
import types from './types'

const reducers = combineReducers({
  acknowledged,
  types,
})

const customerProvidedPrefill = (state = {}, action) => {
  switch (action.type) {
    case API_RESET_WIDGET:
      return reducers(undefined, action)
    default:
      return reducers(state, action)
  }
}

export default customerProvidedPrefill
