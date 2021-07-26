import _ from 'lodash'
import { UPDATE_QUEUE, REMOVE_FROM_QUEUE } from '../base-action-types'

const initialState = {}
const queue = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_QUEUE:
      return {
        ...state,
        ...payload,
      }
    case REMOVE_FROM_QUEUE:
      return _.omit(state, [payload])
    default:
      return state
  }
}

export default queue
