import {
  SET_ACTIVE_FORM_NAME,
  CLEARED_ACTIVE_FORM_NAME
} from 'src/embeds/support/actions/action-types'

const initialState = ''

const activeFormName = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SET_ACTIVE_FORM_NAME:
      return payload.name
    case CLEARED_ACTIVE_FORM_NAME:
      return initialState
    default:
      return state
  }
}

export default activeFormName
