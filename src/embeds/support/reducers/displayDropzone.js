import { DRAG_START, DRAG_END } from 'src/embeds/support/actions/action-types'

const initialState = false

const displayDropzone = (state = initialState, action) => {
  const { type } = action
  switch (type) {
    case DRAG_START:
      return true
    case DRAG_END:
      return false
    default:
      return state
  }
}

export default displayDropzone
