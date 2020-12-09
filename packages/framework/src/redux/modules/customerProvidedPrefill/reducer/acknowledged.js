import { UPDATE_ACKNOWLEDGED } from 'src/redux/modules/customerProvidedPrefill/action-types'

const initialState = {}

const acknowledged = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACKNOWLEDGED:
      return {
        ...state,
        [action.payload.type]: {
          ...(state[action.payload.type] || {}),
          [action.payload.id]: action.payload.timestamp
        }
      }
    default:
      return state
  }
}

export default acknowledged
