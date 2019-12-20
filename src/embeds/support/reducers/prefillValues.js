import { PREFILL_RECEIVED } from 'src/redux/modules/base/base-action-types'

const prefillValues = (state = {}, action) => {
  switch (action.type) {
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...action.payload.prefillValues
      }
    default:
      return state
  }
}

export default prefillValues
