import { PREFILL_RECEIVED } from 'src/redux/modules/base/base-action-types'

const initialState = {
  timestamp: 0,
  values: {}
}

const prefill = (state = initialState, action) => {
  switch (action.type) {
    case PREFILL_RECEIVED:
      return {
        timestamp: action.payload.timestamp,
        values: {
          ...(state.values || {}),
          ...action.payload.prefillValues
        }
      }
    default:
      return state
  }
}

export default prefill
