import {
  GET_IN_TOUCH_SHOWN,
  GET_IN_TOUCH_CLICKED,
} from 'src/embeds/answerBot/actions/conversation/action-types'

const initialState = false

const getInTouchVisible = (state = initialState, action) => {
  switch (action.type) {
    case GET_IN_TOUCH_SHOWN:
      return true
    case GET_IN_TOUCH_CLICKED:
      return false
    default:
      return state
  }
}

export default getInTouchVisible
