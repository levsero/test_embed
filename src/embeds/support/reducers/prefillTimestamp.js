import { PREFILL_RECEIVED } from 'src/redux/modules/base/base-action-types'

const prefillTimestamp = (state = null, action) => {
  switch (action.type) {
    case PREFILL_RECEIVED:
      return action.payload.timestamp
    default:
      return state
  }
}

export default prefillTimestamp
