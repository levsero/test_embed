import { API_RESET_WIDGET } from 'classicSrc/redux/modules/base/base-action-types'
import { combineReducers } from 'redux'
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
