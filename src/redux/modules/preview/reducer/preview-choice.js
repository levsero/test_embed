import { PREVIEW_CHOICE_SELECTED } from '../preview-action-types'
import { CHAT } from 'src/constants/preview'

const initialState = CHAT

const choice = (state = initialState, action) => {
  switch (action.type) {
    case PREVIEW_CHOICE_SELECTED:
      return action.payload
    default:
      return state
  }
}

export default choice
