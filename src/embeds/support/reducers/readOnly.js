import { PREFILL_RECEIVED } from 'src/redux/modules/base/base-action-types'

const initialState = {
  name: false,
  email: false
}

const readOnly = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...payload.isReadOnly
      }
    default:
      return state
  }
}

export default readOnly
