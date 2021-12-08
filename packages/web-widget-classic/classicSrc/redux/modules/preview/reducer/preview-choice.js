import { CHAT } from 'classicSrc/constants/preview'
import { PREVIEW_CHOICE_SELECTED } from '../preview-action-types'

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
