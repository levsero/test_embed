import {
  ATTACHMENT_REMOVED,
  ATTACHMENTS_CLEARED,
  ATTACHMENT_LIMIT_EXCEEDED,
  CLEAR_LIMIT_EXCEEDED_ERROR,
} from 'src/embeds/support/actions/action-types'

const initialState = false

const attachmentLimit = (state = initialState, action) => {
  const { type } = action
  switch (type) {
    case ATTACHMENT_LIMIT_EXCEEDED:
      return true
    case ATTACHMENT_REMOVED:
    case ATTACHMENTS_CLEARED:
    case CLEAR_LIMIT_EXCEEDED_ERROR:
      return initialState
    default:
      return state
  }
}

export default attachmentLimit
