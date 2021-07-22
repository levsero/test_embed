import createKeyID from 'embeds/support/utils/createKeyID'
import { PREFILL_RECEIVED } from 'src/redux/modules/base/base-action-types'

const initialState = {}

const readOnly = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case PREFILL_RECEIVED:
      const newState = { ...state }

      Object.keys(payload.isReadOnly).forEach((id) => {
        newState[createKeyID(id)] = payload.isReadOnly[id]
        newState[id] = payload.isReadOnly[id]
      })

      return newState
    default:
      return state
  }
}

export default readOnly
